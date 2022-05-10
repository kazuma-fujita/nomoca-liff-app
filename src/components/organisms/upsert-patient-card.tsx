import { CheckIcon, CloseIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { RefObject } from "react";
import Webcam from "react-webcam";
import { User } from "../../hooks/use-fetch-user";
import { Camera } from "../atoms/camera";
import { Chip } from "../atoms/chip";
import { ErrorAlert } from "../atoms/error-alert";
import { RoundedButton } from "../atoms/rounded-button";
import { RoundedGrayButton } from "../atoms/rounded-gray-button";
import { MedicalRecordIdRadioButtonForm } from "../molecules/medical-record-id-radio-button-form";
import { MedicalRecordIdTextFieldForm } from "../molecules/medical-record-id-text-field-form";

const getCaptureDescription = (
  error: Error | null,
  isLoading: boolean,
  captureImage: string | null,
  analyzedNumbers: string[],
  isCaptureEnable: boolean
) => {
  let description = "カメラを起動して診察券番号を読み取ってください。";
  if (error) {
    description = "エラーが発生しました。";
  } else if (isLoading) {
    description = "読込中です。";
  } else if (captureImage && analyzedNumbers.length) {
    description = "診察券番号を選択してください。";
  } else if (captureImage && !analyzedNumbers.length) {
    description = "診察券を読み取れませんでした。";
  } else if (isCaptureEnable) {
    description =
      "診察券番号が書いてある面をカメラに向けて読み取るボタンをタップしてください。";
  }

  let icon = CheckIcon;
  if (error || (!isLoading && captureImage && !analyzedNumbers.length)) {
    icon = CloseIcon;
  }
  return { captureResultIcon: icon, captureResultDescription: description };
};

const getCaptureButtonLabel = (
  captureImage: string | null,
  isCaptureEnable: boolean
) => {
  let label = "カメラを起動する";
  if (captureImage) {
    label = "診察券番号を再度読み取る";
  } else if (isCaptureEnable) {
    label = "診察券番号を読み取る";
  }
  return { captureButtonLabel: label };
};

// patient-card.storiesで利用する為 export
export type Props = {
  data: User | null;
  webcamRef: RefObject<Webcam>;
  isCaptureEnable: boolean;
  isCaptureLoading: boolean;
  captureError: Error | null;
  captureImage: string | null;
  analyzedNumbers: string[];
  captureButtonClickHandler: () => void;
  upsertPatient: (param: User) => Promise<any>;
  isUpsertLoading: boolean;
  upsertError: Error | null;
  resetState: () => void;
};

export const UpsertPatientCard = ({
  data,
  webcamRef,
  isCaptureEnable,
  isCaptureLoading,
  captureError,
  captureImage,
  analyzedNumbers,
  captureButtonClickHandler,
  upsertPatient,
  isUpsertLoading,
  upsertError,
  resetState,
}: Props) => {
  const isLoading = isCaptureLoading || isUpsertLoading;

  const { captureResultIcon, captureResultDescription } = getCaptureDescription(
    captureError,
    isCaptureLoading,
    captureImage,
    analyzedNumbers,
    isCaptureEnable
  );

  const { captureButtonLabel } = getCaptureButtonLabel(
    captureImage,
    isCaptureEnable
  );

  return (
    <Center>
      <Box
        maxW={"340px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
        textAlign="center"
      >
        <Stack
          textAlign={"center"}
          p={4}
          color={useColorModeValue("gray.800", "white")}
          align={"center"}
        >
          <Chip>診察券登録</Chip>
        </Stack>

        {isCaptureEnable && (
          <Camera webcamRef={webcamRef} captureImage={captureImage} />
        )}

        <Box bg={useColorModeValue("gray.50", "gray.900")} px={4} py={8}>
          <List spacing={3} fontSize={"sm"}>
            <ListItem>
              <ListIcon as={captureResultIcon} color="green.400" />
              {captureResultDescription}
            </ListItem>
          </List>
          <Box mb={4} />
          {isCaptureLoading && <Spinner color="green.300" size={"lg"} />}
          {captureError && <ErrorAlert>{captureError}</ErrorAlert>}
          {captureImage && analyzedNumbers.length > 0 && (
            <MedicalRecordIdRadioButtonForm
              analyzedNumbers={analyzedNumbers}
              upsertPatient={upsertPatient}
              isLoading={isLoading}
              error={upsertError}
              resetState={resetState}
            />
          )}
          {captureImage && (
            <>
              <Box mb={8} />
              <List spacing={3} fontSize={"sm"}>
                <ListItem>
                  <ListIcon as={CheckIcon} color="green.400" />
                  正常に診察券番号が表示されない場合は再度読み取りをしてください。
                </ListItem>
              </List>
            </>
          )}
          <Box mb={8} />
          <RoundedButton
            onClick={captureButtonClickHandler}
            isLoading={isLoading}
          >
            {captureButtonLabel}
          </RoundedButton>
          {captureImage && (
            <>
              <Box mb={8} />
              <List spacing={3} fontSize={"sm"}>
                <ListItem>
                  <ListIcon as={WarningTwoIcon} color="yellow.400" />
                  手ブレや光の反射、カードに汚れがあると正常に診察券を読み取れない場合があります。
                </ListItem>
                <ListItem>
                  <ListIcon as={WarningTwoIcon} color="yellow.400" />
                  再度読み取りをしても診察券番号が正常に表示されない場合、手動で診察券番号を入力してください。
                </ListItem>
              </List>
              <Box mb={8} />
              <MedicalRecordIdTextFieldForm
                upsertPatient={upsertPatient}
                isLoading={isLoading}
                error={upsertError}
                resetState={resetState}
              />
            </>
          )}
          {data && data.patientId && (
            <>
              <Box mb={8} />
              <RoundedGrayButton onClick={resetState} isLoading={isLoading}>
                キャンセル
              </RoundedGrayButton>
            </>
          )}
        </Box>
      </Box>
    </Center>
  );
};
