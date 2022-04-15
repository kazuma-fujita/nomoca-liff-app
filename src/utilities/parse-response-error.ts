import { GraphQLResult } from "@aws-amplify/api";

export const parseResponseError = (error: any): Error | null => {
  if (!error) return null;

  const errorResult = error as Error;
  if (errorResult.message) {
    return Error(errorResult.message);
  }

  const graphqlResult = error as GraphQLResult;
  if (graphqlResult.errors) {
    return Error(graphqlResult.errors.map((error) => error.message).join("\n"));
  }

  return Error("The error object could not be parsed.");
};
