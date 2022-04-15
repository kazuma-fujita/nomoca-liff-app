import { GraphQLResult } from "@aws-amplify/api";
import {
  CreatePatientInput,
  CreatePatientMutation,
  CreatePatientMutationVariables,
  Patient,
  UpdatePatientInput,
  UpdatePatientMutation,
  UpdatePatientMutationVariables,
} from "../API";
import { API, graphqlOperation } from "aws-amplify";
import {
  createPatient as createPatientMutation,
  updatePatient as updatePatientMutation,
} from "../graphql/mutations";
import { useCallback, useState } from "react";
import { parseResponseError } from "../utilities/parse-response-error";

export const useUpsertPatient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upsertPatient = async (param: Patient) => {
    setIsLoading(true);
    try {
      let ret = null;
      const inputParam = {
        medicalRecordId: param.medicalRecordId,
      };
      if (!param.id) {
        const input: CreatePatientInput = { ...inputParam };
        const variables: CreatePatientMutationVariables = { input: input };
        const result = (await API.graphql(
          graphqlOperation(createPatientMutation, variables)
        )) as GraphQLResult<CreatePatientMutation>;
        if (!result.data || !result.data.createPatient) {
          throw Error("The API created data but it returned null.");
        }
        ret = result.data.createPatient;
      } else {
        // Update Patient
        const input: UpdatePatientInput = { id: param.id, ...inputParam };
        const variables: UpdatePatientMutationVariables = { input: input };
        const result = (await API.graphql(
          graphqlOperation(updatePatientMutation, variables)
        )) as GraphQLResult<UpdatePatientMutation>;
        if (!result.data || !result.data.updatePatient) {
          throw Error("The API updated data but it returned null.");
        }
        ret = result.data.updatePatient;
      }
      setIsLoading(false);
      setError(null);
      return ret;
    } catch (error) {
      const errorResponse = parseResponseError(error);
      setIsLoading(false);
      setError(errorResponse);
      throw errorResponse;
    }
  };

  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return { upsertPatient, isLoading, error, resetState };
};
