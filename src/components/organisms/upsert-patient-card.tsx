import { CheckIcon, CloseIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Center,
  List,
  ListIcon,
  ListItem,
  Radio,
  RadioGroup,
  SlideFade,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useAnalyzePicture } from "../../hooks/use-analyze-picture";
import { Camera } from "../atoms/camera";
import { Chip } from "../atoms/chip";
import { RoundedButton } from "../atoms/rounded-button";
import { RoundedGrayButton } from "../atoms/rounded-gray-button";

type Props = {
  setQRCodeValue: React.Dispatch<React.SetStateAction<string | null>>;
  isUpdateQRCode: boolean;
  setIsUpdateQRCode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UpsertPatientCard = ({
  setQRCodeValue,
  isUpdateQRCode,
  setIsUpdateQRCode,
}: Props) => {
  const {
    analyzePicture,
    analyzedNumbers,
    isLoading,
    error,
    resetAnalyzedData,
  } = useAnalyzePicture();
  const [isCaptureEnable, setCaptureEnable] = useState(false);
  const [selectedRadioValue, setSelectedRadioValue] = useState("");
  const [captureImage, setCaptureImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const resetState = useCallback(() => {
    setCaptureImage(null);
    setCaptureEnable(false);
    setIsUpdateQRCode(false);
    resetAnalyzedData();
  }, [resetAnalyzedData, setIsUpdateQRCode]);

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
      setCaptureImage(imageSrc);
      analyzePicture(imageSrc);
    }
  }, [analyzePicture]);

  const upsertPatientNumber = useCallback(() => {
    if (!selectedRadioValue) {
      // TODO: 数字判定、nullエラー判定
      return;
    }
    // TODO: DB登録処理
    setQRCodeValue(selectedRadioValue);
    resetState();
  }, [resetState, selectedRadioValue, setQRCodeValue]);

  return (
    <Center py={6}>
      <Box
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Stack
          textAlign={"center"}
          p={6}
          color={useColorModeValue("gray.800", "white")}
          align={"center"}
        >
          <Chip>NOMOCA診察券</Chip>
          <Stack direction={"row"} align={"center"} justify={"center"}>
            <Text color={"gray.500"}>診察券登録</Text>
          </Stack>
          {isCaptureEnable && (
            // <SlideFade in={isCaptureEnable} offsetY="360px">
            <Camera webcamRef={webcamRef} captureImage={captureImage} />
            // </SlideFade>
          )}
        </Stack>

        <Box bg={useColorModeValue("gray.50", "gray.900")} px={6} py={10}>
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
                ? "診察券をカメラに向けて読み取ってください。"
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
            <>
              <RadioGroup
                onChange={setSelectedRadioValue}
                value={selectedRadioValue}
              >
                {analyzedNumbers.map((patientNumber, index) => (
                  <Stack key={patientNumber + index} pl={8} spacing={8}>
                    <Radio colorScheme="green" value={patientNumber}>
                      {patientNumber}
                    </Radio>
                  </Stack>
                ))}
              </RadioGroup>
              <Box mb={8} />
              <RoundedButton onClick={upsertPatientNumber}>
                診察券を登録する
              </RoundedButton>
            </>
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
          >
            {captureImage
              ? "診察券を再度読み取る"
              : isCaptureEnable
              ? "診察券を読取る"
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
            </>
          )}
          {isUpdateQRCode && (
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
