import { Box, Grid, VStack } from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { PatientCard } from "../organisms/patient-card";
import { UpsertPatientCard } from "../organisms/upsert-patient-card";

export const AppTemplate = () => {
  const { name, avatarImageUrl } = useAuth();
  // const name = null;
  // const avatarImageUrl = null;
  const [qrCodeValue, setQRCodeValue] = useState<string | null>(null);
  const [isCaptureEnable, setCaptureEnable] = useState(false);
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <VStack spacing={8}>
          {qrCodeValue && !isCaptureEnable ? (
            <PatientCard
              qrCodeValue={qrCodeValue}
              name={name}
              avatarImageUrl={avatarImageUrl}
              setCaptureEnable={setCaptureEnable}
            />
          ) : (
            <UpsertPatientCard
              setQRCodeValue={setQRCodeValue}
              isCaptureEnable={isCaptureEnable}
              setCaptureEnable={setCaptureEnable}
            />
          )}
        </VStack>
      </Grid>
    </Box>
  );
};
