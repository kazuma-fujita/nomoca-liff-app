import { Button } from "@chakra-ui/react";

type Props = {
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

export const RoundedButton: React.FC<Props> = ({ onClick, children }) => {
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
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
