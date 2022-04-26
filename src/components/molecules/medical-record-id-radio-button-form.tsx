import { Box, Radio, RadioGroup, Stack, useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useFetchUser, User } from "../../hooks/use-fetch-user";
import { ErrorAlert } from "../atoms/error-alert";
import { RoundedButton } from "../atoms/rounded-button";

type Props = {
  analyzedNumbers: string[];
  upsertPatient: (param: User) => Promise<any>;
  isLoading: boolean;
  error: Error | null;
  resetState: () => void;
};

export const MedicalRecordIdRadioButtonForm = ({
  analyzedNumbers,
  upsertPatient,
  isLoading,
  error,
  resetState,
}: Props) => {
  const { data } = useFetchUser();
  const [selectedRadioValue, setSelectedRadioValue] = useState("");
  const [validationError, setValidationError] = useState("");

  const toast = useToast();

  const upsertMedicalRecordId = useCallback(() => {
    if (!selectedRadioValue) {
      setValidationError("診察券番号を選択してください");
      return;
    }
    // 認証済の場合、LINEのnameとavatarImageをfetchする為、dataは必ず存在する。
    // data.patientIdはpatientがfetch出来なかった場合nullが入る。
    upsertPatient({
      patientId: data && data.patientId,
      medicalRecordId: selectedRadioValue,
    });
    // 画面状態をリセットし診察券画面表示
    resetState();
    // toast表示
    toast({
      title: "診察券番号を登録しました",
      description: "カメラボタンから再登録ができます",
      status: "success",
    });
  }, [data, resetState, selectedRadioValue, toast, upsertPatient]);

  return (
    <>
      <RadioGroup onChange={setSelectedRadioValue} value={selectedRadioValue}>
        {analyzedNumbers.map((medicalRecordId, index) => (
          <Stack key={medicalRecordId + index} pl={8} spacing={8}>
            <Radio colorScheme="green" value={medicalRecordId}>
              {medicalRecordId}
            </Radio>
          </Stack>
        ))}
      </RadioGroup>
      {validationError && <ErrorAlert mt={4}>{validationError}</ErrorAlert>}
      {error && <ErrorAlert mt={4}>{error}</ErrorAlert>}
      <Box mb={8} />
      <RoundedButton
        onClick={upsertMedicalRecordId}
        isLoading={isLoading}
        disabled={!selectedRadioValue}
      >
        診察券番号を登録する
      </RoundedButton>
    </>
  );
};
