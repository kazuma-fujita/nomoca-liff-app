import { Box, Grid, VStack } from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import { PatientCard } from "../organisms/patient-card";
import { UpsertPatientCard } from "../organisms/upsert-patient-card";

export const AppTemplate = () => {
  const [qrCodeValue, setQRCodeValue] = useState<string | null>(null);
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          {qrCodeValue ? (
            <PatientCard qrCodeValue={qrCodeValue} />
          ) : (
            <UpsertPatientCard setQRCodeValue={setQRCodeValue} />
          )}
          {/* <Text>
            Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
          </Text>
          <Link
            color="teal.500"
            href="https://chakra-ui.com"
            fontSize="2xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Chakra
          </Link> */}
        </VStack>
      </Grid>
    </Box>
  );
};
