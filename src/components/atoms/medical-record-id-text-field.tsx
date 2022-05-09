import { FormErrorMessage, Input } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import { User } from "../../hooks/use-fetch-user";

type Props = UseFormReturn<User> & {
  isLoading: boolean;
};

const maxLength = 256;

export const MedicalRecordIdTextField = ({
  register,
  formState: { errors },
  isLoading,
}: Props) => {
  return (
    <>
      <Input
        type="tel" // number属性はmaxLengthが使用出来ない為、tel属性を使用
        autoComplete="off"
        placeholder="半角数字で入力してください"
        disabled={isLoading}
        maxLength={maxLength}
        {...register("medicalRecordId", {
          required: "診察券番号を入力してください",
          maxLength: {
            value: maxLength,
            message: `診察券番号は${maxLength}桁で入力してください`,
          },
          pattern: {
            value: /^[0-9]+$/i,
            message: "診察券番号は半角数字で入力してください",
          },
        })}
      />
      <FormErrorMessage>
        {errors.medicalRecordId && errors.medicalRecordId.message}
      </FormErrorMessage>
    </>
  );
};
