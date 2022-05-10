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
import { FaCamera } from "react-icons/fa";
import QRCode from "react-qr-code";
import { User } from "../../hooks/use-fetch-user";
import { Chip } from "../atoms/chip";

type Props = {
  data: User | null;
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PatientCard = ({ data, setIsUpdate }: Props) => {
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
        textAlign={"center"}
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
          {data && data.medicalRecordId ? (
            <QRCode value={data.medicalRecordId} />
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
            {data && (
              <>
                <Avatar src={data.avatarImageUrl ?? undefined} />
                <Stack direction={"column"} spacing={0} fontSize={"sm"}>
                  <Text
                    fontWeight={600}
                    overflowWrap={"break-word"}
                    wordBreak={"break-word"}
                  >
                    {data.name ?? "no name"} 様
                  </Text>
                  <Text
                    color={"gray.500"}
                    overflowWrap={"break-word"}
                    wordBreak={"break-word"}
                  >
                    No.&nbsp;{data.medicalRecordId ?? "----"}
                  </Text>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
        <Box pt={4} textAlign="end">
          <IconButton
            aria-label="launch camera"
            icon={<FaCamera />}
            size="sm"
            onClick={() => setIsUpdate(true)}
          />
        </Box>
      </Box>
    </Center>
  );
};
