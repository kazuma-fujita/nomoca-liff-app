import { GraphQLResult } from "@aws-amplify/api";
import { useToast } from "@chakra-ui/react";
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
import { logger } from "../index";

export const useUpsertPatient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useSWRConfig();
  const { swrKey } = useFetchUser();

  const onUpsertPatient =
    (param: User) =>
    async (data: User): Promise<User> => {
      try {
        // 診察券番号はtrim処理をしてから登録
        const medicalRecordId =
          param.medicalRecordId && param.medicalRecordId.trim();
        if (!medicalRecordId) {
          throw Error("A medical record ID is not found.");
        }
        // 診察券番号はtrim処理をしてから登録
        const inputParam = {
          medicalRecordId: medicalRecordId,
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
          const patientId = result.data.createPatient.id;
          logger.info(
            "It succeeded to create a patient.",
            `medical record id: ${medicalRecordId} patientId: ${patientId}`
          );
          return {
            ...data,
            patientId: patientId,
            medicalRecordId: medicalRecordId,
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
          logger.info(
            "It succeeded to update a patient.",
            `medical record id: ${medicalRecordId} patientId: ${param.patientId}`
          );
          return { ...data, medicalRecordId: medicalRecordId };
        }
      } catch (error) {
        const errorResponse = parseResponseError(error);
        setIsLoading(false);
        setError(errorResponse);
        logger.error(
          "An error occurred while creating and updating a patient.",
          errorResponse ? errorResponse.message : "An error was not found."
        );
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
