import { GraphQLResult } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";
import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";
import {
  CreatePatientInput,
  CreatePatientMutation,
  CreatePatientMutationVariables,
  UpdatePatientInput,
  UpdatePatientMutation,
  UpdatePatientMutationVariables,
} from "../API";
import {
  createPatient as createPatientMutation,
  updatePatient as updatePatientMutation,
} from "../graphql/mutations";
import { parseResponseError } from "../utilities/parse-response-error";
import { useFetchUser, User } from "./use-fetch-user";

export const useUpsertPatient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useSWRConfig();
  const { swrKey } = useFetchUser();

  const onUpsertPatient =
    (param: User) =>
    async (data: User): Promise<User> => {
      try {
        if (!param.medicalRecordId) {
          throw Error("A medical record ID is not found.");
        }
        const inputParam = {
          medicalRecordId: param.medicalRecordId,
        };
        if (!param.patientId) {
          const input: CreatePatientInput = { ...inputParam };
          const variables: CreatePatientMutationVariables = { input: input };
          const result = (await API.graphql(
            graphqlOperation(createPatientMutation, variables)
          )) as GraphQLResult<CreatePatientMutation>;
          if (!result.data || !result.data.createPatient) {
            throw Error("The API created data but it returned null.");
          }
          setIsLoading(false);
          setError(null);
          return {
            ...data,
            patientId: result.data.createPatient.id,
            medicalRecordId: param.medicalRecordId,
          };
        } else {
          // Update Patient
          const input: UpdatePatientInput = {
            id: param.patientId,
            ...inputParam,
          };
          const variables: UpdatePatientMutationVariables = { input: input };
          const result = (await API.graphql(
            graphqlOperation(updatePatientMutation, variables)
          )) as GraphQLResult<UpdatePatientMutation>;
          if (!result.data || !result.data.updatePatient) {
            throw Error("The API updated data but it returned null.");
          }
          setIsLoading(false);
          setError(null);
          return { ...data, medicalRecordId: param.medicalRecordId };
        }
      } catch (error) {
        const errorResponse = parseResponseError(error);
        setIsLoading(false);
        setError(errorResponse);
        throw errorResponse;
      }
    };

  // mutateを実行してstoreで保持しているstateを更新。mutateの第1引数にはkeyを指定し、第2引数で状態変更を実行する関数を指定。mutateの戻り値はPromise<any>。
  // 第3引数にfalseを指定した場合はfetchは実行せずローカルstateのみ更新
  const upsertPatient = useCallback(
    async (param: User) => mutate(swrKey, onUpsertPatient(param), false),
    [mutate, swrKey]
  );

  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return { upsertPatient, isLoading, error, resetState };
};
