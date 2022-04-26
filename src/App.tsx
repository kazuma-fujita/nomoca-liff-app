import { ChakraProvider, theme } from "@chakra-ui/react";
import * as React from "react";
import { AppTemplate } from "./components/templates/app-template";
import { UserContextProvider } from "./hooks/use-fetch-user";

export const App = () => (
  <ChakraProvider theme={theme}>
    <UserContextProvider>
      <AppTemplate />
    </UserContextProvider>
  </ChakraProvider>
);
