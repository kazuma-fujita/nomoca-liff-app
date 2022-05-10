import type { ComponentStoryObj } from "@storybook/react";
import { User } from "../../hooks/use-fetch-user";
import { PatientCard } from "./patient-card";

const description = `

# Use Case

### 前提条件

- 本アプリケーションのメインユーザはClinicBotを利用するLINEユーザ
- 本アプリケーションは1LINEユーザに対し、診察券番号(QRコード)を1つのみ保持する
- 登録する診察券番号はDB登録を前提とし、永続的に保持する

### ユーザユースケース

1. ClinicBotの診察券から本アプリケーション起動
1. LIFF APPパーミッション許可(認証)ダイアログ表示
  - 許可が必要な項目
    - プロフィール情報
    - ユーザー識別子
1. パーミッション許可後、診察券番号登録フォームへ遷移
1. 診察券番号登録操作後、診察券番号QRコードを表示した診察券カード画面へ遷移
1. 診察券カードのQRコードを利用し診療受付

### 複数医院でQRコードを利用するケース

- 1LINEユーザは診察券番号(QRコード)を1つのみ保持する為、複数医院での同時利用は想定しない
  - ※ 但し、ユーザが複数医院でアクティブに利用するユースケースは無い事を2022/04/27 LINE WORKSにて確認済み

### A医院を通院しなくなったユーザが新たにB医院へ通院するケース

- ユーザはB医院の診察券番号をアップデート(上書き登録)することにより対応可能

# Specs

## QRコード

- 診察券番号をQRコード化し、画像として表示
  - 診察券番号が取得出来なかった場合画像非表示

## アバター画像

- LINE認証にて取得したLINEアバター画像を表示
  - \`liff.getProfile()\` の \`pictureUrl\` から取得
  - アバター画像を取得出来なかった場合デフォルト画像を表示

## 名前

- LINE認証にて取得したLINEユーザ名を表示
  - \`liff.getProfile()\` の \`displayName\` から取得
  - 長いユーザー名は折返し表示
  - ユーザ名が取得出来なかった場合 \`no name\` を表示

## 診察券番号

- 診察券登録フォームにて登録した診察券番号を表示
  - 長い診察券番号は折返し表示
  - 診察券番号が取得出来なかった場合 \`----\` 表示

## 診察券番号アップデート(上書き登録)カメラアイコン

1. カメラアイコンタップ後、診察券番号登録フォーム画面へ遷移
1. 診察券番号アップデート操作後、再度診察券カードUI表示
1. アップデート後の診察券番号をQRコード化し画像としてカードUIに表示

## LINEから本アプリケーション連動削除手順

以下手順でアプリ連携の削除が可能。

1. LINEアプリから設定画面へ遷移
1. アカウント
1. 連動アプリ
1. 診察券を選択
1. 連携を解除

連携削除操作後、再び本アプリ表示時LIFF APPパーミッション許可ダイアログが表示されるのでLINE認証のテストケースで活用すること。

`;

type Story = ComponentStoryObj<typeof PatientCard>;

export default { title: "診察券カード", component: PatientCard };

const data: User = {
  patientId: "dummy-ID",
  medicalRecordId: "1234",
  name: "佐藤 太郎",
  avatarImageUrl: "https://www.w3schools.com/howto/img_avatar.png",
};

export const Default: Story = {
  args: {
    data: data,
  },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const LongStrings: Story = {
  ...Default,
  args: {
    data: {
      ...data,
      medicalRecordId:
        "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
      name: "長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列長い文字列",
    },
  },
};

export const Empty: Story = {
  ...Default,
  args: {
    data: {
      ...data,
      medicalRecordId: null,
      name: null,
      avatarImageUrl: null,
    },
  },
};
