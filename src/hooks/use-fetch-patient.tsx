import { GraphQLResult } from "@aws-amplify/api";
import { Patient, ListPatientsQuery } from "../API";
import { API, graphqlOperation } from "aws-amplify";
import { listPatients } from "../graphql/queries";
import { FetchResponse, useFetch } from "./use-fetch";
import { createContext, useContext } from "react";

const swrKey = "patient";

type ProviderProps = FetchResponse<Patient | null> & {
  swrKey: string;
};

const PatientContext = createContext({} as ProviderProps);

export const useFetchPatient = () => useContext(PatientContext);

const fetcher = async () => {
  // Graphql query操作実行
  const result = (await API.graphql(
    graphqlOperation(listPatients)
  )) as GraphQLResult<ListPatientsQuery>;
  if (
    !result.data ||
    !result.data.listPatients ||
    !result.data.listPatients.items
  ) {
    throw Error("It was returned null after the API had fetched data.");
  }
  const patients = result.data.listPatients.items as Patient[];
  if (patients.length > 1) {
    throw Error("It was found two patients or over.");
  }
  return patients.length ? patients[0] : null;
};

export const PatientContextProvider: React.FC = ({ ...rest }) => {
  const response = useFetch<Patient | null>(swrKey, fetcher, {
    revalidateOnFocus: false,
  });
  return <PatientContext.Provider value={{ ...response, swrKey }} {...rest} />;
};
