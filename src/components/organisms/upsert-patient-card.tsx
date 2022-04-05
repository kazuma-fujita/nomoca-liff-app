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
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useCallback, useRef, useState } from "react";
import { Camera } from "../atoms/camera";
import Webcam from "react-webcam";

export const UpsertPatientCard = () => {
  const [response, setResponse] = useState("Please capture image.");
  const [isCaptureEnable, setCaptureEnable] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const reLaunchCamera = useCallback(() => {
    setImageUrl(null);
    setCaptureEnable(true);
  }, []);

  const toggleLaunchCamera = useCallback(() => {
    setCaptureEnable(!isCaptureEnable);
  }, [isCaptureEnable]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImageUrl(imageSrc);
      //   Predictions.identify({
      //     text: {
      //       source: {
      //         bytes: Buffer.from(
      //           imageSrc.replace("data:image/jpeg;base64,", ""),
      //           "base64"
      //         ),
      //       },
      //       format: "ALL",
      //     },
      //   })
      //     .then((response) => {
      //       console.log("response:", response);
      //       const {
      //         text: {
      //           // same as PLAIN + FORM + TABLE
      //           fullText,
      //         },
      //       } = response;
      //       setResponse(fullText);
      //     })
      //     .catch((err) => console.error("error:", { err }));
    }
  }, [webcamRef]);
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
            <Camera webcamRef={webcamRef} imageUrl={imageUrl} />
          )}
        </Stack>

        <Box bg={useColorModeValue("gray.50", "gray.900")} px={6} py={10}>
          <List spacing={3} fontSize={"sm"}>
            <ListItem>
              <ListIcon as={CheckIcon} color="green.400" />
              カメラを起動して診察券番号を読み取ってください。
            </ListItem>
          </List>
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
              imageUrl
                ? reLaunchCamera
                : isCaptureEnable
                ? capture
                : toggleLaunchCamera
            }
          >
            {imageUrl
              ? "診察券を再度読み取る"
              : isCaptureEnable
              ? "診察券を読取る"
              : "カメラを起動する"}
          </Button>
        </Box>
      </Box>
    </Center>
  );
};
