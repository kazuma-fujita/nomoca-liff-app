import { GraphQLResult } from "@aws-amplify/api";
import { CognitoUser } from "@aws-amplify/auth";
import liff from "@line/liff";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createContext, useContext } from "react";
import { ListPatientsQuery, Patient } from "../API";
import { listPatients } from "../graphql/queries";
import { FetchResponse, useFetch } from "./use-fetch";

const swrKey = "user";

export type User = {
  patientId: string | null;
  medicalRecordId: string | null;
  name?: string | null;
  avatarImageUrl?: string | null;
};

type ProviderProps = FetchResponse<User | null> & {
  swrKey: string;
};

const UserContext = createContext({} as ProviderProps);

export const useFetchUser = () => useContext(UserContext);

export const UserContextProvider: React.FC = ({ ...rest }) => {
  const response = useFetch<User | null>(swrKey, fetcher, {
    revalidateOnFocus: false,
  });
  return <UserContext.Provider value={{ ...response, swrKey }} {...rest} />;
};

const fetcher = async (): Promise<User | null> => {
  try {
    console.log("before liff init");
    // 初期化
    await liff.init({
      liffId: process.env.REACT_APP_LIFF_ID as string,
    });
    console.log("after liff init");
    // ログイン判定
    if (!liff.isLoggedIn()) {
      console.log("It tries liff logging.");
      liff.login(); // ログインしていなければLINE Auth実行
      return null;
    }
    console.log("It tries get profile after LINE logging in.");
    const profile = await liff.getProfile(); // LINEユーザ情報取得
    console.log("line ID:", profile.userId);
    console.log("name:", profile.displayName);
    console.log("picture:", profile.pictureUrl);
    // Cognito認証処理
    const cognitoUser = await cognitoAuth(profile.userId);
    console.log("cognitoUser:", cognitoUser);
    const patient = await fetchPatient();
    console.log("patient:", patient);
    return {
      patientId: patient ? patient.id : null,
      name: profile.displayName,
      avatarImageUrl: profile.pictureUrl ?? null,
      medicalRecordId: patient ? patient.medicalRecordId : null,
    };
  } catch (error) {
    throw error;
  }
};

const cognitoAuth = async (username: string): Promise<CognitoUser> => {
  try {
    console.log("check cognito signin");
    // Cognito signin確認
    const cognitoUser = await Auth.currentAuthenticatedUser();
    // Cognitoのusername1文字目を大文字変換
    // e.g.) LINE userId U61214110a... Cognito username u61214110a...
    const lineUserId =
      cognitoUser.username.charAt(0).toUpperCase() +
      cognitoUser.username.slice(1);
    // セッション中の username とLINEログインした LINE userId の突き合わせ
    if (lineUserId !== username) {
      console.log("Try sign out.");
      // 別LINEユーザーでログインした場合ログアウト
      await Auth.signOut({ global: true });
      // 再帰処理実行
      cognitoAuth(username);
    }
    console.log("return cognitoAuth");
    return cognitoUser;
  } catch (err) {
    // 未認証の場合必ずnot authenticated errorが返却される
    const password = process.env.REACT_APP_COGNITO_USER_PASSWORD as string;
    try {
      console.log("execute cognito signin");
      // signin処理
      return await Auth.signIn({
        username: username,
        password: password,
      });
    } catch (err) {
      try {
        console.log("execute cognito signup");
        // signUp処理 裏でPre sign-up Lambda Triggersが起動し確認コード認証をスキップ
        await Auth.signUp({
          username: username,
          password: password,
        });
        console.log("execute cognito signin again");
        // Cognito user 作成後 改めてsignin処理
        await Auth.signIn({
          username: username,
          password: password,
        });
        // 認証出来ているか確認かつ、認証Cognito userを取得
        return await Auth.currentAuthenticatedUser();
      } catch (error) {
        throw error;
      }
    }
  }
};

const fetchPatient = async (): Promise<Patient | null> => {
  // Graphql query操作実行
  const result = (await API.graphql(
    graphqlOperation(listPatients)
  )) as GraphQLResult<ListPatientsQuery>;
  if (
    !result.data ||
    !result.data.listPatients ||
    !result.data.listPatients.items
  ) {
    throw Error("It was returned null after the API had fetched data.");
  }

  const patients = result.data.listPatients.items as Patient[];
  // LINEユーザー:cognitoユーザー:patientデータは 1:1:1 なので複数patientデータはエラー処理
  if (patients.length > 1) {
    throw Error("It was found two patients or over.");
  }

  return patients.length ? patients[0] : null;
};
