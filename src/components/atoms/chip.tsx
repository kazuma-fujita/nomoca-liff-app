import { Text, useColorModeValue } from "@chakra-ui/react";

export const Chip: React.FC = ({ children }) => {
  return (
    <Text
      fontSize={"sm"}
      fontWeight={500}
      bg={useColorModeValue("green.50", "green.900")}
      p={2}
      px={3}
      color={"green.500"}
      rounded={"full"}
    >
      {children}
    </Text>
  );
};
