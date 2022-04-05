import {
  Box,
  Center,
  Text,
  Stack,
  List,
  ListItem,
  ListIcon,
  Button,
  useColorModeValue,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { useCallback, useRef, useState } from "react";
import { Camera } from "../atoms/camera";
import Webcam from "react-webcam";
import Predictions, {
  AmazonAIPredictionsProvider,
} from "@aws-amplify/predictions";
import Amplify from "aws-amplify";
import awsconfig from "../../aws-exports";
import { type } from "os";

type Props = {
  setQRCodeValue: React.Dispatch<React.SetStateAction<string | null>>;
};

export const UpsertPatientCard = ({ setQRCodeValue }: Props) => {
  const [patientNumbers, setPatientNumbers] = useState<string[]>([]);
  const [isCaptureEnable, setCaptureEnable] = useState(false);
  const [selectedRadioValue, setSelectedRadioValue] = useState("");
  const [captureImage, setCaptureImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const reLaunchCamera = useCallback(() => {
    setCaptureImage(null);
    setPatientNumbers([]);
    setCaptureEnable(true);
  }, []);

  const toggleLaunchCamera = useCallback(() => {
    setCaptureEnable(!isCaptureEnable);
  }, [isCaptureEnable]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCaptureImage(imageSrc);
      Predictions.identify({
        text: {
          source: {
            bytes: Buffer.from(
              imageSrc.replace("data:image/jpeg;base64,", ""),
              "base64"
            ),
          },
          format: "PLAIN", // PLAIN or FORM or TABLE
        },
      })
        .then((response) => {
          console.log("response:", response);
          const {
            text: { words },
          } = response;

          const numbers = words
            .filter((word) => word.text && /^-?\d+$/.test(word.text))
            .map((word) => word.text!);
          // .map((word) => Number(word.text));
          console.log("numbers:", numbers);
          setPatientNumbers(numbers);
        })
        .catch((err) => console.error("error:", { err }));
    }
  }, [webcamRef]);

  const upsertPatientNumber = useCallback(() => {
    if (!selectedRadioValue) {
      // TODO: 数字判定、nullエラー判定
      return;
    }
    // TODO: DB登録処理
    setQRCodeValue(selectedRadioValue);
  }, [selectedRadioValue, setQRCodeValue]);

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
          <Text
            fontSize={"sm"}
            fontWeight={500}
            bg={useColorModeValue("green.50", "green.900")}
            p={2}
            px={3}
            color={"green.500"}
            rounded={"full"}
          >
            NOMOCA診察券
          </Text>
          <Stack direction={"row"} align={"center"} justify={"center"}>
            <Text color={"gray.500"}>診察券登録</Text>
          </Stack>
          {isCaptureEnable && (
            <Camera webcamRef={webcamRef} captureImage={captureImage} />
          )}
        </Stack>

        <Box bg={useColorModeValue("gray.50", "gray.900")} px={6} py={10}>
          <List spacing={3} fontSize={"sm"}>
            <ListItem>
              <ListIcon as={CheckIcon} color="green.400" />
              {captureImage && patientNumbers.length
                ? "診察券番号を選択してください。"
                : captureImage && !patientNumbers.length
                ? "診察券を読み取れませんでした。再度読み取りしてください。"
                : isCaptureEnable
                ? "診察券をカメラに向けて読み取ってください。"
                : "カメラを起動して診察券番号を読み取ってください。"}
            </ListItem>
          </List>
          {captureImage && patientNumbers.length > 0 && (
            <>
              <Box pb={4} />
              <RadioGroup
                onChange={setSelectedRadioValue}
                value={selectedRadioValue}
              >
                {patientNumbers.map((patientNumber, index) => (
                  <Stack key={patientNumber + index} pl={8} spacing={8}>
                    <Radio colorScheme="green" value={patientNumber}>
                      {patientNumber}
                    </Radio>
                  </Stack>
                ))}
              </RadioGroup>
              <Button
                mt={10}
                w={"full"}
                bg={"green.400"}
                color={"white"}
                rounded={"xl"}
                boxShadow={"0 5px 20px 0px rgb(72 187 120 / 43%)"}
                _hover={{
                  bg: "green.500",
                }}
                _focus={{
                  bg: "green.500",
                }}
                onClick={upsertPatientNumber}
              >
                診察券を登録する
              </Button>
            </>
          )}
          {captureImage && (
            <>
              <Box pb={8} />
              <List spacing={3} fontSize={"sm"}>
                <ListItem>
                  <ListIcon as={WarningTwoIcon} color="yellow.400" />
                  手ブレや光の反射で正常に診察券を読み込めない場合があります。
                </ListItem>
              </List>
            </>
          )}
          <Button
            mt={10}
            w={"full"}
            bg={"green.400"}
            color={"white"}
            rounded={"xl"}
            boxShadow={"0 5px 20px 0px rgb(72 187 120 / 43%)"}
            _hover={{
              bg: "green.500",
            }}
            _focus={{
              bg: "green.500",
            }}
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
          </Button>
          {captureImage && (
            <>
              <Box pb={8} />
              <List spacing={3} fontSize={"sm"}>
                <ListItem>
                  <ListIcon as={WarningTwoIcon} color="yellow.400" />
                  手書きの番号やカードに汚れがあると正常に診察券を読み取れない場合があります。
                </ListItem>
                <ListItem>
                  <ListIcon as={WarningTwoIcon} color="yellow.400" />
                  診察券番号が正常に表示されない場合、手動で診察券番号を入力してください。
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </Box>
    </Center>
  );
};
