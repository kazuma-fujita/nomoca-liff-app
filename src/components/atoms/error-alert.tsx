import { Alert, AlertIcon, AlertProps } from "@chakra-ui/react";

export const ErrorAlert: React.FC<AlertProps> = ({ children, ...rest }) => {
  return (
    <Alert status="error" fontSize={"sm"} rounded={"xl"} {...rest}>
      <AlertIcon />
      {children}
    </Alert>
  );
};
