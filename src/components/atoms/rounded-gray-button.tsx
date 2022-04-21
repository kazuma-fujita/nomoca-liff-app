import { Button, ButtonProps } from "@chakra-ui/react";

export const RoundedGrayButton: React.FC<ButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <Button
      w={"full"}
      bg={"gray.400"}
      color={"white"}
      rounded={"xl"}
      boxShadow={"0 5px 20px 0px rgb(72 187 120 / 43%)"}
      _hover={{
        bg: "gray.500",
      }}
      _focus={{
        bg: "gray.500",
      }}
      // onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
};
