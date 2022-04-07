import liff from "@line/liff";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [lineId, setLineId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(null);
  useEffect(() => {
    // 本番環境のみLINE認証実行
    if (process.env.NODE_ENV === "production") {
      const func = async () => {
        liff
          .init({ liffId: process.env.REACT_APP_LIFF_ID as string })
          .then(() => {
            if (!liff.isLoggedIn()) {
              liff.login({}); // ログインしていなければ最初にログインする
            } else {
              liff
                .getProfile() // ユーザ情報を取得する
                .then((profile) => {
                  setLineId(profile.userId);
                  setName(profile.displayName);
                  setAvatarImageUrl(profile.pictureUrl ?? null);
                  console.log(
                    `Name: ${name}, userId: ${lineId}, statusMessage: ${profile.statusMessage}, pictureURL: ${profile.pictureUrl}`
                  );
                })
                .catch(function (error) {
                  console.log("Error sending message: " + error);
                });
            }
          });
      };
      func();
    }
  }, []);
  return { lineId, name, avatarImageUrl };
};
