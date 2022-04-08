import liff from "@line/liff";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [lineId, setLineId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // 本番環境のみLINE認証実行
    if (process.env.NODE_ENV === "production") {
      const func = async () => {
        setLoading(true);
        try {
          // 初期化
          await liff.init({ liffId: process.env.REACT_APP_LIFF_ID as string });
          // ログイン判定
          if (!liff.isLoggedIn()) {
            liff.login({}); // ログインしていなければ最初にログインする
          } else {
            const profile = await liff.getProfile(); // ユーザ情報を取得する
            setLineId(profile.userId);
            setName(profile.displayName);
            setAvatarImageUrl(profile.pictureUrl ?? null);
            const token = liff.getIDToken();
            if (!token) {
              throw Error("Line ID Token is not found.");
            }
            console.log("token:", token);
            console.log("decoded:", decodeJwt(token));
            console.log("ID:", profile.userId);
            // const user = await Auth.signUp({
            //   username: token.slice(0, 128),
            //   password: process.env.REACT_APP_COGNITO_PASSWORD as string,
            // });
            // console.log("user:", user);
            // const user = await Auth.signIn(
            //   token.slice(0, 128),
            //   process.env.REACT_APP_COGNITO_PASSWORD
            // );
          }
          setLoading(false);
        } catch (err) {
          const error = err as Error;
          console.error("Error sending message: " + error.message);
          setError(error.message);
          setLoading(false);
        }
      };
      func();
    } else {
      setLoading(true);
      const func = async () => {
        try {
          const user = await Auth.signUp({
            username: "testUser1",
            // password: process.env.REACT_APP_COGNITO_PASSWORD as string,
            password: "1qaz2wsx",
          });
          console.log("user:", user);
          // const user = await Auth.signIn(
          //   token.slice(0, 128),
          //   process.env.REACT_APP_COGNITO_PASSWORD
          // );
          setLoading(false);
        } catch (err) {
          const error = err as Error;
          console.error("Error sending message: " + error.message);
          setError(error.message);
          setLoading(false);
        }
      };
      func();
    }
  }, []);
  return { lineId, name, avatarImageUrl, isLoading, error };
};

const decodeJwt = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
};
