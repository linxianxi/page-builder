/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useMemo, useState } from "react";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { useUpdateEffect } from "react-use";

import request from "../../utils/request";

import { OperationVariables } from "./interfaces/OperationVariables";

export type CacheKey = string | readonly unknown[];

export interface CreateLazyQueryOptions<
  TVariables extends OperationVariables = OperationVariables
> {
  method?: "get" | "post" | "put" | "patch" | "delete";
  buildUrl: (variables?: TVariables) => string;
  buildCacheKey?: (variables?: TVariables) => CacheKey;
  cacheKey?: CacheKey;
}

export type LazyQueryHookOptions<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
> = Pick<UseQueryOptions<TData, Error>, "retry" | "retryDelay">;

export interface LazyQueryOptions<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
> {
  variables?: TVariables;
}

export type LazyQueryTuple<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
> = [
  (options?: LazyQueryOptions<TVariables>) => void,
  UseQueryResult<TData, Error>
];

export type UseLazyQuery<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
> = (
  hookOptions?: LazyQueryHookOptions<TVariables>
) => LazyQueryTuple<TData, TVariables>;

export function createUseLazyQuery<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  createOptions: CreateLazyQueryOptions<TVariables>
): UseLazyQuery<TData, TVariables> & {
  getCacheKey: (variables?: TVariables) => CacheKey;
} {
  const getCacheKey = (variables?: TVariables) =>
    createOptions?.buildCacheKey?.(variables) ||
    createOptions?.cacheKey ||
    createOptions.buildUrl(variables);

  const hook = (
    hookOptions?: LazyQueryHookOptions<TData, TVariables>
  ): LazyQueryTuple<TData, TVariables> => {
    const [lazyQueryOptions, setLazyQueryOptions] = useState<
      LazyQueryOptions<TData, TVariables>
    >({});

    const url = useMemo(
      () => createOptions.buildUrl(lazyQueryOptions?.variables),
      [lazyQueryOptions?.variables]
    );

    const fn = useCallback((options) => setLazyQueryOptions(options || {}), []);

    const result = useQuery<TData, Error, TData>(
      getCacheKey(lazyQueryOptions?.variables),
      () => {
        return request(url, {
          method: createOptions?.method || "GET",
          params: lazyQueryOptions?.variables?.query,
          data: lazyQueryOptions?.variables?.data,
        });
      },
      {
        ...hookOptions,
        refetchOnWindowFocus: false,
        enabled: false,
      }
    );

    useUpdateEffect(() => {
      result.refetch();
    }, [lazyQueryOptions, result.refetch]);

    return useMemo(() => {
      return [fn, result];
    }, [fn, result]);
  };

  hook.getCacheKey = getCacheKey;

  return hook;
}
