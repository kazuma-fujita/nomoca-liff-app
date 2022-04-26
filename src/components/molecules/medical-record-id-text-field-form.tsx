import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useFetchUser, User } from "../../hooks/use-fetch-user";
import { ErrorAlert } from "../atoms/error-alert";
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

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const toast = useToast();

  const submitHandler = handleSubmit(
    useCallback(
      async (param) => {
        try {
          // 認証済の場合、LINEのnameとavatarImageをfetchする為、dataは必ず存在する。
          // data.patientIdはpatientがfetch出来なかった場合nullが入る。
          await upsertPatient({
            patientId: data && data.patientId,
            medicalRecordId: param.medicalRecordId,
          });
          // 画面状態をリセットし診察券画面表示
          resetState();
          // toast表示
          toast({
            title: "診察券番号を登録しました",
            description: "カメラボタンから再登録ができます",
            status: "success",
          });
        } catch (error) {}
      },
      [data, resetState, upsertPatient, toast]
    )
  );

  return (
    <>
      <form onSubmit={submitHandler} noValidate>
        <FormControl isInvalid={errors.medicalRecordId}>
          <FormLabel htmlFor="medicalRecordId" color="gray.500" fontSize="sm">
            診察券番号
          </FormLabel>
          <Input
            type="number"
            autoComplete="off"
            placeholder="半角数字で入力してください"
            disabled={isLoading}
            {...register("medicalRecordId", {
              required: "診察券番号を入力してください",
              pattern: {
                value: /^[0-9]+$/i,
                message: "診察券番号は半角数字で入力してください",
              },
            })}
          />
          <FormErrorMessage>
            {errors.medicalRecordId && errors.medicalRecordId.message}
          </FormErrorMessage>
          {error && <ErrorAlert mt={4}>{error}</ErrorAlert>}
          <Box mb={4} />
          <RoundedButton type="submit" isLoading={isSubmitting || isLoading}>
            入力した診察券番号を登録する
          </RoundedButton>
        </FormControl>
      </form>
    </>
  );
};
