import { GraphQLResult } from "@aws-amplify/api";
import { CognitoUser } from "@aws-amplify/auth";
import liff from "@line/liff";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createContext, useContext } from "react";
import {
  ModelSortDirection,
  Patient,
  QueryPatientsByOwnerSortedCreatedAtQuery,
  QueryPatientsByOwnerSortedCreatedAtQueryVariables,
} from "../API";
import { queryPatientsByOwnerSortedCreatedAt } from "../graphql/queries";
import { FetchResponse, useFetch } from "./use-fetch";
import { logger } from "../index";

const swrKey = "user";

export type User = {
  patientId: string | null;
  medicalRecordId: string | null;
  name?: string | null;
  avatarImageUrl?: string | null;
  owner?: string | null;
};

type ProviderProps = FetchResponse<User | null> & {
  swrKey: string;
};

const UserContext = createContext({} as ProviderProps);

export const useFetchUser = () => useContext(UserContext);

export const UserContextProvider: React.FC = ({ ...rest }) => {
  const response = useFetch<User | null>(swrKey, selectFetcher, {
    revalidateOnFocus: false,
  });
  return <UserContext.Provider value={{ ...response, swrKey }} {...rest} />;
};

const selectFetcher = async (): Promise<User | null> => {
  const storybookEnv = process.env.STORYBOOK_ENV as string;
  if (storybookEnv && storybookEnv === "storybook") {
    return {
      patientId: null,
      medicalRecordId: null,
      name: null,
      avatarImageUrl: null,
      owner: null,
    };
  }
  return await fetcher();
};

const fetcher = async (): Promise<User | null> => {
  // const logger = useLogger();
  try {
    logger.info("initializes the LIFF app");
    // 初期化
    await liff.init({
      liffId: process.env.REACT_APP_LIFF_ID as string,
    });
    // ログイン判定
    if (!liff.isLoggedIn()) {
      logger.info("tries to sign in for LINE");
      // ログインしていなければLINE Auth実行
      liff.login();
      return null;
    }
    // LINEユーザ情報取得
    const profile = await liff.getProfile();
    logger.info(`${profile.displayName} succeeded in to sign in for LINE.`);
    // Cognito認証処理
    const cognitoUser = await cognitoAuth(profile.userId);
    const cognitoUserId = cognitoUser.getUsername();
    logger.info(
      `It succeeded in to sign in for Cognito.`,
      `Cognito username: ${cognitoUserId}`
    );
    const patient = await fetchPatient(cognitoUserId);
    logger.info(
      `A medical record id that fetched is ${
        patient ? patient.medicalRecordId : "none"
      }`
    );
    return {
      patientId: patient ? patient.id : null,
      name: profile.displayName,
      avatarImageUrl: profile.pictureUrl ?? null,
      medicalRecordId: patient ? patient.medicalRecordId : null,
      owner: cognitoUserId,
    };
  } catch (error) {
    logger.error(
      "An error occurred during the authentication process",
      (error as Error).message
    );
    throw error;
  }
};

const cognitoAuth = async (username: string): Promise<CognitoUser> => {
  try {
    logger.info("checks already Cognito user exists");
    // Cognito signin確認
    const cognitoUser = await Auth.currentAuthenticatedUser();
    // Cognitoのusername1文字目を大文字変換
    // e.g.) LINE userId U61214110a... Cognito username u61214110a...
    const lineUserId =
      cognitoUser.username.charAt(0).toUpperCase() +
      cognitoUser.username.slice(1);
    // セッション中の username とLINEログインした LINE userId の突き合わせ
    if (lineUserId !== username) {
      logger.info("tries to sign out for Cognito");
      // 別LINEユーザーでログインした場合ログアウト
      await Auth.signOut({ global: true });
      // 再帰処理実行
      cognitoAuth(username);
    }
    return cognitoUser;
  } catch (err) {
    // 未認証の場合必ずnot authenticated errorが返却される
    const password = process.env.REACT_APP_COGNITO_USER_PASSWORD as string;
    try {
      logger.info("tres to sign in for Cognito");
      // signin処理
      return await Auth.signIn({
        username: username,
        password: password,
      });
    } catch (err) {
      try {
        logger.info("tres to sign up for Cognito");
        // signUp処理 裏でPre sign-up Lambda Triggersが起動し確認コード認証をスキップ
        await Auth.signUp({
          username: username,
          password: password,
        });
        logger.info("tres to sign in for Cognito again");
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

const fetchPatient = async (ownerId: string): Promise<Patient | null> => {
  // Graphql query操作実行
  const variables: QueryPatientsByOwnerSortedCreatedAtQueryVariables = {
    owner: ownerId,
    sortDirection: ModelSortDirection.DESC,
  };
  const result = (await API.graphql(
    graphqlOperation(queryPatientsByOwnerSortedCreatedAt, variables)
  )) as GraphQLResult<QueryPatientsByOwnerSortedCreatedAtQuery>;
  if (
    !result.data ||
    !result.data.queryPatientsByOwnerSortedCreatedAt ||
    !result.data.queryPatientsByOwnerSortedCreatedAt.items
  ) {
    throw Error("It was returned null after the API had fetched data.");
  }
  //   const result = (await API.graphql(
  //     graphqlOperation(listPatients)
  //   )) as GraphQLResult<ListPatientsQuery>;
  //   if (
  //     !result.data ||
  //     !result.data.listPatients ||
  //     !result.data.listPatients.items
  //   ) {
  //     throw Error("It was returned null after the API had fetched data.");
  //   }

  const patients = result.data.queryPatientsByOwnerSortedCreatedAt
    .items as Patient[];
  logger.info("patients", patients);
  // LINEユーザー:cognitoユーザー:patientデータは 1:1:1 なので複数patientデータはエラー処理
  //   if (patients.length > 1) {
  //     throw Error("It was found two patients or over.");
  //   }

  return patients.length > 0 ? patients[0] : null;
};
