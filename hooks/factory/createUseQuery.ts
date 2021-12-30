/* eslint-disable react-hooks/rules-of-hooks */

import { useMemo } from "react";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

import request from "../../utils/request";

import { OperationVariables } from "./interfaces/OperationVariables";

export type CacheKey = string | readonly unknown[];

export interface CreateQueryOptions<
  TVariables extends OperationVariables = OperationVariables
> {
  method?: "get" | "post" | "put" | "patch" | "delete";
  buildUrl: (variables?: TVariables) => string;
  buildCacheKey?: (variables?: TVariables) => CacheKey;
  cacheKey?: CacheKey;
}

export interface QueryHookOptions<
  TVariables extends OperationVariables = OperationVariables
> {
  variables?: TVariables;
}

export type UseQuery<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
> = ((
  hookOptions?: QueryHookOptions<TVariables>,
  config?: UseQueryOptions<TData, Error, TData, CacheKey>
) => UseQueryResult<TData, Error>) & {
  getCacheKey: (variables?: TVariables) => CacheKey;
};

export function createUseQuery<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(createOptions: CreateQueryOptions<TVariables>): UseQuery<TData, TVariables> {
  const getCacheKey = (variables?: TVariables) =>
    createOptions?.buildCacheKey?.(variables) ||
    createOptions?.cacheKey ||
    createOptions.buildUrl(variables);

  const hook = (
    hookOptions?: QueryHookOptions<TVariables>,
    config?: UseQueryOptions<TData, Error, TData, CacheKey>
  ): UseQueryResult<TData, Error> => {
    const url = createOptions.buildUrl(hookOptions?.variables);

    const result = useQuery<TData, Error, TData>(
      getCacheKey(hookOptions?.variables),
      () => {
        return request(url, {
          method: createOptions?.method || "GET",
          params: hookOptions?.variables?.query,
          data: hookOptions?.variables?.data,
        });
      },
      config
    );

    return useMemo(() => {
      return result;
    }, [result]);
  };

  hook.getCacheKey = getCacheKey;

  return hook;
}
