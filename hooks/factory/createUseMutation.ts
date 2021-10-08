import { useMemo } from "react";
import {
  QueryClient,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "react-query";

import request from "../../utils/request";

import { OperationVariables } from "./interfaces/OperationVariables";

export interface CreateMutationOptions<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
> {
  buildUrl: (variables?: TVariables) => string;
  method?: "get" | "post" | "put" | "patch" | "delete";
  update?: MutationUpdater<TData, TVariables>;
  onError?: (
    error: Error,
    variables: TVariables,
    context: unknown
  ) => void | Promise<unknown>;
}

export type MutationUpdater<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
> = (queryClient: QueryClient, data: TData, variables: TVariables) => void;

export interface MutationHookOptions<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
> {
  update?: MutationUpdater<TData, TVariables>;
  onError?: (
    error: Error,
    variables: TVariables,
    context: unknown
  ) => void | Promise<unknown>;
}

export type MutationTuple<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
> = [
  (variables?: TVariables) => Promise<TData>,
  UseMutationResult<TData, Error, TVariables, unknown>
];

export type UseMutation<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
> = (hookOptions?: MutationHookOptions) => MutationTuple<TData, TVariables>;

export function createUseMutation<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  createOptions: CreateMutationOptions<TData, TVariables>
): UseMutation<TData, TVariables> {
  return (hookOptions?: MutationHookOptions) => {
    // const ref = useRef<MutationTuple<TData, TVariables>>();

    const queryClient = useQueryClient();

    const result = useMutation<TData, Error, TVariables>(
      (variables) => {
        return request(createOptions.buildUrl(variables), {
          method: createOptions?.method || "GET",
          params: variables?.query,
          data: variables?.data,
        });
      },
      {
        onSuccess(data, variables) {
          (hookOptions?.update || createOptions?.update)?.(
            queryClient,
            data,
            variables
          );
        },
        onError(error, variables, context) {
          (hookOptions?.onError || createOptions?.onError)?.(
            error,
            variables,
            context
          );
        },
      }
    );

    return useMemo<MutationTuple<TData, TVariables>>(() => {
      return [
        (variables?: TVariables) =>
          result.mutateAsync(variables || ({} as TVariables)),
        result,
      ];
    }, [result]);
  };
}
