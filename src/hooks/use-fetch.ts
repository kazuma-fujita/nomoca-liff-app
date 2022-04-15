import useSWR, { Fetcher, Key, KeyedMutator } from "swr";
import { PublicConfiguration } from "swr/dist/types";
import { parseResponseError } from "../utilities/parse-response-error";

export type FetchResponse<Data = any> = {
  data: Data | null;
  error: Error | null;
  isLoading: boolean;
  isEmptyList: boolean;
  mutate: KeyedMutator<Data>;
};

export const useFetch = <Data = any>(
  key: Key,
  fetcher: Fetcher<Data> | null,
  config?: Partial<PublicConfiguration<Data, any, Fetcher<Data>>> | undefined
): FetchResponse<Data> => {
  const { data, error, mutate } = useSWR<Data>(key, fetcher, config);
  return {
    data: data ?? null,
    error: error ? parseResponseError(error) : null,
    isLoading: Boolean(!data && !error),
    isEmptyList: Boolean(Array.isArray(data) && data.length === 0),
    mutate: mutate,
  } as const;
};
