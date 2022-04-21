import { Button, ButtonProps } from "@chakra-ui/react";

export const RoundedButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
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
      {...rest}
    >
      {children}
    </Button>
  );
};
