import { ChakraProvider, theme } from "@chakra-ui/react";
import * as React from "react";
import { AppTemplate } from "./components/templates/app-template";

export const App = () => (
  <ChakraProvider theme={theme}>
    <AppTemplate />
  </ChakraProvider>
);
