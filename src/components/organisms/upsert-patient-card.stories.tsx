import type { ComponentStoryObj } from "@storybook/react";
import { useCallback } from "react";
import { useCaptureImage } from "../../hooks/use-capture-image";
import { User } from "../../hooks/use-fetch-user";
import { useUpsertPatient } from "../../hooks/use-upsert-patient";
import { Props, UpsertPatientCard } from "./upsert-patient-card";

const description = `

# Specs

## カメラを起動するボタン

1. ボタンタップ後、WEBカメラ使用許可ダイアログ表示
  - 許可ボタンタップ後、WEBカメラ起動
	- ブロックボタンタップ後、カメラ非表示(その後の挙動はブラウザに依存)

## 診察券番号を読み取るボタン

1. 診察券を読み取るボタンタップで診察券撮影
1. ローディング表示
1. 診察券番号候補をRadioボタンでリスト表示

**以下のケースで正常に診察券番号が読み取れない可能性有り**

  - 診察券番号がブレて撮影されている
  - 診察券番号部分に折れや汚れ、破れがある
  - 診察券番号部分に光の反射が写り込んでいる
  - 診察券番号が枠で囲われていたり番号に下線が引かれている
  - 診察券番号が黒以外の文字色で印字されている

## 診察券番号を再度読み取るボタン

1. 診察券番号が読み取れない場合の撮影再試行ボタン
1. ボタンタップ後、WEBカメラ起動
  - 既にカメラ使用許可をしている為、使用許可ダイアログは表示されないこと

## 診察券番号を登録するボタン

1. 診察券番号候補Radioボタンの診察券番号を選択
  - 診察券番号未選択時、ボタンはDisabled表示
1. 登録ボタンをタップ
1. ローディング表示
1. DB登録処理
  - DB登録エラー時、エラー文言を表示
  - 登録処理正常終了後、診察券カード画面へ遷移
    - 登録完了メッセージをToast表示

## 診察券番号入力フォーム

- 診察券番号が正常に読み取れなかった場合の手動入力用フォーム
- 入力バリデーションはValidations項目参照

## 入力した診察券番号を登録するボタン

1. 診察券番号入力TextBoxに値を入力
1. 登録ボタンをタップ
1. ローディング表示
1. DB登録処理
  - DB登録エラー時、エラー文言を表示
  - 登録処理正常終了後、診察券カード画面へ遷移
    - 登録完了メッセージをToast表示

## キャンセルボタン

- 診察券番号アップデート(上書き更新)時のみ表示
- ボタンタップ後、診察券カード画面へ遷移

# Validations

## 診察券番号入力TextBox

| 項目 | 値 |
| ---: | :--- |
| 必須 | ◯ |
| 種類 | TextBox |
| 型 | Numeric |
| 最大桁 | 128 |
| 備考 | Validation エラー文言はTextBox下部に表示 |

| 種別 | エラー文言 |
| ---: | :--- |
| 必須 | 診察券番号を入力してください |
| 型 | 診察券番号は半角数字で入力してください |
| 最大桁 | 診察券番号は128桁で入力してください |

- Validation事後処理
  -  半角全角tabスペーストリム処理

`;

const Wrapper: React.FC<Props> = (props) => {
  const data: User = {
    patientId: "dummy-ID",
    medicalRecordId: null,
    name: null,
    avatarImageUrl: null,
  };

  const {
    webcamRef,
    isCaptureEnable,
    isLoading: isCaptureLoading,
    error: captureError,
    captureImage,
    analyzedNumbers,
    captureButtonClickHandler,
    resetState: resetCaptureState,
  } = useCaptureImage();

  const {
    upsertPatient,
    isLoading: isUpsertLoading,
    error: upsertError,
    resetState: resetUpsertState,
  } = useUpsertPatient();

  const resetState = useCallback(() => {
    resetCaptureState();
    resetUpsertState();
    // setIsUpdate(false);
  }, [resetCaptureState, resetUpsertState]);

  return (
    <UpsertPatientCard
      data={data}
      webcamRef={webcamRef}
      isCaptureEnable={isCaptureEnable}
      isCaptureLoading={props.isCaptureLoading ?? isCaptureLoading}
      captureError={props.captureError ?? captureError}
      captureImage={props.captureImage ?? captureImage}
      analyzedNumbers={analyzedNumbers}
      captureButtonClickHandler={captureButtonClickHandler}
      upsertPatient={upsertPatient}
      isUpsertLoading={props.isUpsertLoading ?? isUpsertLoading}
      upsertError={props.upsertError ?? upsertError}
      resetState={resetState}
    />
  );
};

type Story = ComponentStoryObj<typeof Wrapper>;

export default { title: "診察券番号登録フォーム", component: Wrapper };

export const Default: Story = {
  // args: { data: orderListMock },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const Loading: Story = {
  ...Default,
  args: { isCaptureLoading: true, isUpsertLoading: true, captureImage: "" },
};

// export const ErrorOccurred: Story = {
//   ...Default,
//   args: {
//     captureError: Error("A error occurred during to capture image."),
//     upsertError: Error("It was returned null after the API had fetched data."),
//   },
// };
