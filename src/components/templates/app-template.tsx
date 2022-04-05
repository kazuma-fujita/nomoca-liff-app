import { Box, Grid, VStack } from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import { useAuth } from "../../hooks/use-auth";
import { PatientCard } from "../organisms/patient-card";
import { UpsertPatientCard } from "../organisms/upsert-patient-card";

export const AppTemplate = () => {
  const { name, avatarImageUrl } = useAuth();
  const [qrCodeValue, setQRCodeValue] = useState<string | null>(null);
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          {qrCodeValue ? (
            <PatientCard
              qrCodeValue={qrCodeValue}
              name={name}
              avatarImageUrl={avatarImageUrl}
            />
          ) : (
            <UpsertPatientCard setQRCodeValue={setQRCodeValue} />
          )}
        </VStack>
      </Grid>
    </Box>
  );
};
