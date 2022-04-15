import { Box, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useFetchUser, User } from "../../hooks/use-fetch-user";
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

  const upsertMedicalRecordId = useCallback(() => {
    if (!selectedRadioValue) {
      // TODO: 数字判定、nullエラー判定
      return;
    }
    // 認証済の場合、LINEのnameとavatarImageをfetchする為、dataは必ず存在する。
    // data.patientIdはpatientがfetch出来なかった場合nullが入る。
    upsertPatient({
      patientId: data && data.patientId,
      medicalRecordId: selectedRadioValue,
    });
    resetState();
  }, [data, resetState, selectedRadioValue, upsertPatient]);

  return (
    <>
      <RadioGroup onChange={setSelectedRadioValue} value={selectedRadioValue}>
        {analyzedNumbers.map((patientNumber, index) => (
          <Stack key={patientNumber + index} pl={8} spacing={8}>
            <Radio colorScheme="green" value={patientNumber}>
              {patientNumber}
            </Radio>
          </Stack>
        ))}
      </RadioGroup>
      <Box mb={8} />
      <RoundedButton onClick={upsertMedicalRecordId} isLoading={isLoading}>
        診察券番号を登録する
      </RoundedButton>
    </>
  );
};
