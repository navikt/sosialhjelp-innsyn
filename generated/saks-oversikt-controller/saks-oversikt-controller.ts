/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {useQuery} from "@tanstack/react-query";
import type {UseQueryOptions, QueryFunction, UseQueryResult, QueryKey} from "@tanstack/react-query";
import type {SaksDetaljerResponse, HentSaksDetaljerParams, SaksListeResponse} from "../model";
import {axiosInstance} from "../../src/axios-instance";
import type {ErrorType} from "../../src/axios-instance";

// eslint-disable-next-line
type SecondParameter<T extends (...args: any) => any> = T extends (config: any, args: infer P) => any ? P : never;

export const hentSaksDetaljer = (
    params: HentSaksDetaljerParams,
    options?: SecondParameter<typeof axiosInstance>,
    signal?: AbortSignal
) => {
    return axiosInstance<SaksDetaljerResponse>(
        {url: `/api/v1/innsyn/saksDetaljer`, method: "get", params, signal},
        options
    );
};

export const getHentSaksDetaljerQueryKey = (params: HentSaksDetaljerParams) =>
    [`/api/v1/innsyn/saksDetaljer`, ...(params ? [params] : [])] as const;

export const getHentSaksDetaljerQueryOptions = <
    TData = Awaited<ReturnType<typeof hentSaksDetaljer>>,
    TError = ErrorType<unknown>,
>(
    params: HentSaksDetaljerParams,
    options?: {
        query?: UseQueryOptions<Awaited<ReturnType<typeof hentSaksDetaljer>>, TError, TData>;
        request?: SecondParameter<typeof axiosInstance>;
    }
): UseQueryOptions<Awaited<ReturnType<typeof hentSaksDetaljer>>, TError, TData> & {queryKey: QueryKey} => {
    const {query: queryOptions, request: requestOptions} = options ?? {};

    const queryKey = queryOptions?.queryKey ?? getHentSaksDetaljerQueryKey(params);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof hentSaksDetaljer>>> = ({signal}) =>
        hentSaksDetaljer(params, requestOptions, signal);

    return {queryKey, queryFn, ...queryOptions};
};

export type HentSaksDetaljerQueryResult = NonNullable<Awaited<ReturnType<typeof hentSaksDetaljer>>>;
export type HentSaksDetaljerQueryError = ErrorType<unknown>;

export const useHentSaksDetaljer = <TData = Awaited<ReturnType<typeof hentSaksDetaljer>>, TError = ErrorType<unknown>>(
    params: HentSaksDetaljerParams,
    options?: {
        query?: UseQueryOptions<Awaited<ReturnType<typeof hentSaksDetaljer>>, TError, TData>;
        request?: SecondParameter<typeof axiosInstance>;
    }
): UseQueryResult<TData, TError> & {queryKey: QueryKey} => {
    const queryOptions = getHentSaksDetaljerQueryOptions(params, options);

    const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {queryKey: QueryKey};

    query.queryKey = queryOptions.queryKey;

    return query;
};

export const hentAlleSaker = (options?: SecondParameter<typeof axiosInstance>, signal?: AbortSignal) => {
    return axiosInstance<SaksListeResponse[]>({url: `/api/v1/innsyn/saker`, method: "get", signal}, options);
};

export const getHentAlleSakerQueryKey = () => [`/api/v1/innsyn/saker`] as const;

export const getHentAlleSakerQueryOptions = <
    TData = Awaited<ReturnType<typeof hentAlleSaker>>,
    TError = ErrorType<unknown>,
>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof hentAlleSaker>>, TError, TData>;
    request?: SecondParameter<typeof axiosInstance>;
}): UseQueryOptions<Awaited<ReturnType<typeof hentAlleSaker>>, TError, TData> & {queryKey: QueryKey} => {
    const {query: queryOptions, request: requestOptions} = options ?? {};

    const queryKey = queryOptions?.queryKey ?? getHentAlleSakerQueryKey();

    const queryFn: QueryFunction<Awaited<ReturnType<typeof hentAlleSaker>>> = ({signal}) =>
        hentAlleSaker(requestOptions, signal);

    return {queryKey, queryFn, ...queryOptions};
};

export type HentAlleSakerQueryResult = NonNullable<Awaited<ReturnType<typeof hentAlleSaker>>>;
export type HentAlleSakerQueryError = ErrorType<unknown>;

export const useHentAlleSaker = <
    TData = Awaited<ReturnType<typeof hentAlleSaker>>,
    TError = ErrorType<unknown>,
>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof hentAlleSaker>>, TError, TData>;
    request?: SecondParameter<typeof axiosInstance>;
}): UseQueryResult<TData, TError> & {queryKey: QueryKey} => {
    const queryOptions = getHentAlleSakerQueryOptions(options);

    const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {queryKey: QueryKey};

    query.queryKey = queryOptions.queryKey;

    return query;
};