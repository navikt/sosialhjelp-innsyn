/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {useQuery} from "@tanstack/react-query";
import type {UseQueryOptions, QueryFunction, UseQueryResult, QueryKey} from "@tanstack/react-query";
import type {SoknadsStatusResponse} from "../model";
import {axiosInstance} from "../../src/axios-instance";
import type {ErrorType} from "../../src/axios-instance";

// eslint-disable-next-line
type SecondParameter<T extends (...args: any) => any> = T extends (config: any, args: infer P) => any ? P : never;

export const hentSoknadsStatus = (
    fiksDigisosId: string,
    options?: SecondParameter<typeof axiosInstance>,
    signal?: AbortSignal
) => {
    return axiosInstance<SoknadsStatusResponse>(
        {url: `/api/v1/innsyn/${fiksDigisosId}/soknadsStatus`, method: "get", signal},
        options
    );
};

export const getHentSoknadsStatusQueryKey = (fiksDigisosId: string) =>
    [`/api/v1/innsyn/${fiksDigisosId}/soknadsStatus`] as const;

export const getHentSoknadsStatusQueryOptions = <
    TData = Awaited<ReturnType<typeof hentSoknadsStatus>>,
    TError = ErrorType<unknown>,
>(
    fiksDigisosId: string,
    options?: {
        query?: UseQueryOptions<Awaited<ReturnType<typeof hentSoknadsStatus>>, TError, TData>;
        request?: SecondParameter<typeof axiosInstance>;
    }
): UseQueryOptions<Awaited<ReturnType<typeof hentSoknadsStatus>>, TError, TData> & {queryKey: QueryKey} => {
    const {query: queryOptions, request: requestOptions} = options ?? {};

    const queryKey = queryOptions?.queryKey ?? getHentSoknadsStatusQueryKey(fiksDigisosId);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof hentSoknadsStatus>>> = ({signal}) =>
        hentSoknadsStatus(fiksDigisosId, requestOptions, signal);

    return {queryKey, queryFn, enabled: !!fiksDigisosId, ...queryOptions};
};

export type HentSoknadsStatusQueryResult = NonNullable<Awaited<ReturnType<typeof hentSoknadsStatus>>>;
export type HentSoknadsStatusQueryError = ErrorType<unknown>;

export const useHentSoknadsStatus = <
    TData = Awaited<ReturnType<typeof hentSoknadsStatus>>,
    TError = ErrorType<unknown>,
>(
    fiksDigisosId: string,
    options?: {
        query?: UseQueryOptions<Awaited<ReturnType<typeof hentSoknadsStatus>>, TError, TData>;
        request?: SecondParameter<typeof axiosInstance>;
    }
): UseQueryResult<TData, TError> & {queryKey: QueryKey} => {
    const queryOptions = getHentSoknadsStatusQueryOptions(fiksDigisosId, options);

    const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {queryKey: QueryKey};

    query.queryKey = queryOptions.queryKey;

    return query;
};