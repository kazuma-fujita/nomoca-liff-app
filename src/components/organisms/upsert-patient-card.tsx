import { CheckIcon, CloseIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Center,
  List,
  ListIcon,
  ListItem,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
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
  const [selectedRadioValue, setSelectedRadioValue] = useState("");
  const [captureImage, setCaptureImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const { upsertPatient } = useUpsertPatient();
  const { data } = useFetchUser();

  const resetState = useCallback(() => {
    setCaptureImage(null);
    setCaptureEnable(false);
    resetAnalyzedData();
    setIsUpdate(false);
  }, [resetAnalyzedData, setIsUpdate]);

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
    // 認証済の場合、LINEのnameとavatarImageをfetchする為、dataは必ず存在する。
    // data.patientIdはpatientがfetch出来なかった場合nullが入る。
    upsertPatient({
      patientId: data && data.patientId,
      medicalRecordId: selectedRadioValue,
    });
    resetState();
  }, [data, resetState, selectedRadioValue, upsertPatient]);

  const [textValue, setTextValue] = useState("");

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // TODO: 数字Validation
      setTextValue(event.target.value);
    },
    []
  );

  const upsertPatientNumberWithManual = useCallback(() => {
    if (!textValue) {
      // TODO: 数字判定、nullエラー判定
      return;
    }
    // TODO: DB登録処理
    upsertPatient({
      patientId: data && data.patientId,
      medicalRecordId: textValue,
    });
    resetState();
  }, [data, resetState, textValue, upsertPatient]);

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
              <RoundedButton
                onClick={upsertPatientNumber}
                isLoading={isLoading}
              >
                診察券番号を登録する
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
              <RoundedButton
                onClick={upsertPatientNumberWithManual}
                isLoading={isLoading}
              >
                入力した診察券番号を登録する
              </RoundedButton>
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
