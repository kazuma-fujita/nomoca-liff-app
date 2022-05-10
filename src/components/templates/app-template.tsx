import { Alert, AlertIcon, Box, Grid, Spinner, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useFetchUser } from "../../hooks/use-fetch-user";
import { PatientCardContainer } from "../organisms/patient-card-container";
import { UpsertPatientCardContainer } from "../organisms/upsert-patient-card-container";

export const AppTemplate = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const { data, isLoading, error } = useFetchUser();
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <VStack spacing={8}>
          {isLoading && <Spinner color="green.300" size={"xl"} mt={32} />}
          {error && (
            <Alert status="error" fontSize={"sm"} rounded={"xl"}>
              <AlertIcon />
              {error.message}
            </Alert>
          )}
          {!isLoading && !error && (
            <>
              {!data || !data.patientId || isUpdate ? (
                <UpsertPatientCardContainer setIsUpdate={setIsUpdate} />
              ) : (
                <PatientCardContainer setIsUpdate={setIsUpdate} />
              )}
            </>
          )}
        </VStack>
      </Grid>
    </Box>
  );
};
