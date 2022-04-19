import { Alert, AlertIcon } from "@chakra-ui/react";

export const ErrorAlert: React.FC = ({ children }) => {
  return (
    <Alert status="error" fontSize={"sm"} rounded={"xl"}>
      <AlertIcon />
      {children}
    </Alert>
  );
};
