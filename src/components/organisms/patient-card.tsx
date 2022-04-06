import {
  Avatar,
  Box,
  Center,
  IconButton,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import QRCode from "react-qr-code";
import { Chip } from "../atoms/chip";
import { FaCamera } from "react-icons/fa";

type Props = {
  qrCodeValue: string | null;
  name: string | null;
  avatarImageUrl: string | null;
  setCaptureEnable: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PatientCard = ({
  qrCodeValue,
  name,
  avatarImageUrl,
  setCaptureEnable,
}: Props) => {
  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundColor: "gray.800",
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          {qrCodeValue ? (
            <QRCode value={qrCodeValue} />
          ) : (
            <Image
              rounded={"lg"}
              height={230}
              width={282}
              objectFit={"cover"}
            />
          )}
        </Box>
        <Box mb={16} />
        <Stack align={"center"}>
          <Chip>NOMOCA診察券</Chip>
          <Box paddingBottom={2} />
          <Stack mt={6} direction={"row"} spacing={4} align={"right"}>
            <Avatar src={avatarImageUrl ?? undefined} />
            <Stack direction={"column"} spacing={0} fontSize={"sm"}>
              <Text fontWeight={600}>{name ?? "no name"} 様</Text>
              <Text color={"gray.500"}>No.&nbsp;{qrCodeValue}</Text>
            </Stack>
          </Stack>
        </Stack>
        <Box pt={4} textAlign="end">
          <IconButton
            aria-label="launch camera"
            icon={<FaCamera />}
            size="sm"
            onClick={() => setCaptureEnable(true)}
          />
        </Box>
      </Box>
    </Center>
  );
};
