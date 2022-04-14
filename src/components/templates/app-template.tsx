import {
  Box,
  Grid,
  VStack,
  Button,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
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
          {isLoading && <Spinner color="green.300" size={"lg"} />}
          {error && (
            <Alert status="error" fontSize={"sm"} rounded={"xl"}>
              <AlertIcon />
              {error}
            </Alert>
          )}
          {(!isLoading || !error) && qrCodeValue && !isUpdateQRCode ? (
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
