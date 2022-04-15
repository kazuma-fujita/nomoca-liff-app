import { Box, NumberInput, NumberInputField } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useFetchUser, User } from "../../hooks/use-fetch-user";
import { RoundedButton } from "../atoms/rounded-button";

type Props = {
  upsertPatient: (param: User) => Promise<any>;
  isLoading: boolean;
  error: Error | null;
  resetState: () => void;
};

export const MedicalRecordIdTextFieldForm = ({
  upsertPatient,
  isLoading,
  error,
  resetState,
}: Props) => {
  const { data } = useFetchUser();

  const [textValue, setTextValue] = useState("");

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // TODO: 数字Validation
      setTextValue(event.target.value);
    },
    []
  );

  const upsertMedicalRecordId = useCallback(() => {
    if (!textValue) {
      // TODO: 数字判定、nullエラー判定
      return;
    }
    // 認証済の場合、LINEのnameとavatarImageをfetchする為、dataは必ず存在する。
    // data.patientIdはpatientがfetch出来なかった場合nullが入る。
    upsertPatient({
      patientId: data && data.patientId,
      medicalRecordId: textValue,
    });
    resetState();
  }, [data, resetState, textValue, upsertPatient]);

  return (
    <>
      <NumberInput>
        <NumberInputField
          placeholder="診察券番号"
          _placeholder={{ color: "inherit" }}
          value={textValue}
          onChange={handleTextChange}
          disabled={isLoading}
        />
      </NumberInput>
      <Box mb={4} />
      <RoundedButton onClick={upsertMedicalRecordId} isLoading={isLoading}>
        入力した診察券番号を登録する
      </RoundedButton>
    </>
  );
};
