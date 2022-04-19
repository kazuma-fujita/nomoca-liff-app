import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Center,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useCaptureImage } from "../../hooks/use-capture-image";
import { useFetchUser } from "../../hooks/use-fetch-user";
import { useUpsertPatient } from "../../hooks/use-upsert-patient";
import { Camera } from "../atoms/camera";
import { Chip } from "../atoms/chip";
import { ErrorAlert } from "../atoms/error-alert";
import { RoundedButton } from "../atoms/rounded-button";
import { RoundedGrayButton } from "../atoms/rounded-gray-button";
import { MedicalRecordIdRadioButtonForm } from "../molecules/medical-record-id-radio-button-form";
import { MedicalRecordIdTextFieldForm } from "../molecules/medical-record-id-text-field-form";

type Props = {
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UpsertPatientCard = ({ setIsUpdate }: Props) => {
  const {
    webcamRef,
    isCaptureEnable,
    isLoading: isCaptureLoading,
    error: captureError,
    captureImage,
    analyzedNumbers,
    captureResultIcon,
    captureResultDescription,
    captureButtonClickHandler,
    captureButtonLabel,
    resetState: resetCaptureState,
  } = useCaptureImage();

  const {
    upsertPatient,
    isLoading: isUpsertLoading,
    error: isUpsertError,
    resetState: resetUpsertState,
  } = useUpsertPatient();
  const { data } = useFetchUser();

  const resetState = useCallback(() => {
    resetCaptureState();
    resetUpsertState();
    setIsUpdate(false);
  }, [resetCaptureState, resetUpsertState, setIsUpdate]);

  return (
    <Center>
      <Box
        maxW={"340px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
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
              isLoading={isUpsertLoading}
              error={isUpsertError}
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
            isLoading={isCaptureLoading}
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
                isLoading={isUpsertLoading}
                error={isUpsertError}
                resetState={resetState}
              />
            </>
          )}
          {data && data.patientId && (
            <>
              <Box mb={8} />
              <RoundedGrayButton onClick={resetState}>
                キャンセル
              </RoundedGrayButton>
            </>
          )}
        </Box>
      </Box>
    </Center>
  );
};
