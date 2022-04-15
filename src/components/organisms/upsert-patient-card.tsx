import { CheckIcon, CloseIcon, WarningTwoIcon } from "@chakra-ui/icons";
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
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useAnalyzePicture } from "../../hooks/use-analyze-picture";
import { useFetchUser } from "../../hooks/use-fetch-user";
import { useUpsertPatient } from "../../hooks/use-upsert-patient";
import { Camera } from "../atoms/camera";
import { Chip } from "../atoms/chip";
import { RoundedButton } from "../atoms/rounded-button";
import { RoundedGrayButton } from "../atoms/rounded-gray-button";
import { MedicalRecordIdRadioButtonForm } from "../molecules/medical-record-id-radio-button-form";
import { MedicalRecordIdTextFieldForm } from "../molecules/medical-record-id-text-field-form";

type Props = {
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UpsertPatientCard = ({ setIsUpdate }: Props) => {
  const {
    analyzePicture,
    analyzedNumbers,
    isLoading,
    error,
    resetAnalyzedData,
  } = useAnalyzePicture();
  const [isCaptureEnable, setCaptureEnable] = useState(false);
  const [captureImage, setCaptureImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const {
    upsertPatient,
    isLoading: isUpsertLoading,
    error: isUpsertError,
    resetState: resetUpsertState,
  } = useUpsertPatient();
  const { data } = useFetchUser();

  const resetState = useCallback(() => {
    setCaptureImage(null);
    setCaptureEnable(false);
    resetAnalyzedData();
    resetUpsertState();
    setIsUpdate(false);
  }, [resetAnalyzedData, resetUpsertState, setIsUpdate]);

  const reLaunchCamera = useCallback(() => {
    setCaptureImage(null);
    setCaptureEnable(true);
    resetAnalyzedData();
  }, [resetAnalyzedData, setCaptureEnable]);

  const toggleLaunchCamera = useCallback(() => {
    setCaptureEnable(!isCaptureEnable);
  }, [isCaptureEnable, setCaptureEnable]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // キャプチャ画像確認用imgタグに値をセット
      setCaptureImage(imageSrc);
      // 画像解析実行
      analyzePicture(imageSrc);
    }
  }, [analyzePicture]);

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
              <ListIcon
                as={
                  error ||
                  (!isLoading && captureImage && !analyzedNumbers.length)
                    ? CloseIcon
                    : CheckIcon
                }
                color="green.400"
              />
              {error
                ? "エラーが発生しました。"
                : isLoading
                ? "読込中です。"
                : captureImage && analyzedNumbers.length
                ? "診察券番号を選択してください。"
                : captureImage && !analyzedNumbers.length
                ? "診察券を読み取れませんでした。"
                : isCaptureEnable
                ? "診察券番号が書いてある面をカメラに向けて読み取るボタンをタップしてください。"
                : "カメラを起動して診察券番号を読み取ってください。"}
            </ListItem>
          </List>
          <Box mb={4} />
          {isLoading && <Spinner color="green.300" size={"lg"} />}
          {error && (
            <Alert status="error" fontSize={"sm"} rounded={"xl"}>
              <AlertIcon />
              {error}
            </Alert>
          )}
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
            onClick={
              captureImage
                ? reLaunchCamera
                : isCaptureEnable
                ? capture
                : toggleLaunchCamera
            }
            isLoading={isLoading}
          >
            {captureImage
              ? "診察券番号を再度読み取る"
              : isCaptureEnable
              ? "診察券番号を読み取る"
              : "カメラを起動する"}
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
