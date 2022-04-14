import { Box, Grid, VStack, Button } from "@chakra-ui/react";
import { Auth } from "aws-amplify";
import * as React from "react";
import { useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { PatientCard } from "../organisms/patient-card";
import { UpsertPatientCard } from "../organisms/upsert-patient-card";

export const AppTemplate = () => {
  const { name, avatarImageUrl, isLoading, error } = useAuth();
  const [qrCodeValue, setQRCodeValue] = useState<string | null>(null);
  const [isUpdateQRCode, setIsUpdateQRCode] = useState(false);
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <VStack spacing={8}>
          {qrCodeValue && !isUpdateQRCode ? (
            <PatientCard
              qrCodeValue={qrCodeValue}
              name={name}
              avatarImageUrl={avatarImageUrl}
              setIsUpdateQRCode={setIsUpdateQRCode}
            />
          ) : (
            <UpsertPatientCard
              setQRCodeValue={setQRCodeValue}
              isUpdateQRCode={isUpdateQRCode}
              setIsUpdateQRCode={setIsUpdateQRCode}
            />
          )}
          <Button onClick={() => Auth.signOut()} />
        </VStack>
      </Grid>
    </Box>
  );
};
