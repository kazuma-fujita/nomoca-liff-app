import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Grid,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { Auth } from "aws-amplify";
import * as React from "react";
import { useState } from "react";
import { useFetchUser } from "../../hooks/use-fetch-user";
import { PatientCard } from "../organisms/patient-card";
import { UpsertPatientCard } from "../organisms/upsert-patient-card";

export const AppTemplate = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const { data, isLoading, error } = useFetchUser();
  console.log("data:", data);
  console.log("isLoad:", isLoading);
  console.log("error:", error);
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <VStack spacing={8}>
          {isLoading && <Spinner color="green.300" size={"lg"} />}
          {error && (
            <Alert status="error" fontSize={"sm"} rounded={"xl"}>
              <AlertIcon />
              {error.message}
            </Alert>
          )}
          {!isLoading && !error && (
            <>
              {!data || !data.patientId || isUpdate ? (
                <UpsertPatientCard setIsUpdate={setIsUpdate} />
              ) : (
                <PatientCard setIsUpdate={setIsUpdate} />
              )}
            </>
          )}
          <Button onClick={() => Auth.signOut()} />
        </VStack>
      </Grid>
    </Box>
  );
};
