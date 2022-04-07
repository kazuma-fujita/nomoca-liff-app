import liff from "@line/liff";
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
            console.log(
              `Name: ${name}, userId: ${lineId}, statusMessage: ${profile.statusMessage}, pictureURL: ${profile.pictureUrl}`
            );
            const token = liff.getIDToken();
            console.log("token:", token);
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
    }
  }, []);
  return { lineId, name, avatarImageUrl, isLoading, error };
};
