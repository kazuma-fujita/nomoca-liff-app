import { Button } from "@chakra-ui/react";

type Props = {
  isLoading: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  type?: "submit" | "reset" | "button";
};

export const RoundedButton: React.FC<Props> = ({
  isLoading,
  onClick,
  type,
  children,
}) => {
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
      type={type ?? "button"}
      onClick={onClick}
      isLoading={isLoading}
    >
      {children}
    </Button>
  );
};
