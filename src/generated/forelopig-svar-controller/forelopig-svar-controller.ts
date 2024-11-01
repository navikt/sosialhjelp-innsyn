/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {useQuery} from "@tanstack/react-query";
import type {QueryFunction, QueryKey, UseQueryOptions, UseQueryResult} from "@tanstack/react-query";
import type {ForelopigSvarResponse} from ".././model";
import {axiosInstance} from "../../axios-instance";
import type {ErrorType} from "../../axios-instance";

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

export const hentForelopigSvarStatus = (
    fiksDigisosId: string,
    options?: SecondParameter<typeof axiosInstance>,
    signal?: AbortSignal
) => {
    return axiosInstance<ForelopigSvarResponse>(
        {url: `/api/v1/innsyn/${fiksDigisosId}/forelopigSvar`, method: "GET", signal},
        options
    );
};

export const getHentForelopigSvarStatusQueryKey = (fiksDigisosId: string) => {
    return [`/api/v1/innsyn/${fiksDigisosId}/forelopigSvar`] as const;
};

export const getHentForelopigSvarStatusQueryOptions = <
    TData = Awaited<ReturnType<typeof hentForelopigSvarStatus>>,
    TError = ErrorType<unknown>,
>(
    fiksDigisosId: string,
    options?: {
        query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof hentForelopigSvarStatus>>, TError, TData>>;
        request?: SecondParameter<typeof axiosInstance>;
    }
) => {
    const {query: queryOptions, request: requestOptions} = options ?? {};

    const queryKey = queryOptions?.queryKey ?? getHentForelopigSvarStatusQueryKey(fiksDigisosId);

    const queryFn: QueryFunction<Awaited<ReturnType<typeof hentForelopigSvarStatus>>> = ({signal}) =>
        hentForelopigSvarStatus(fiksDigisosId, requestOptions, signal);

    return {queryKey, queryFn, enabled: !!fiksDigisosId, ...queryOptions} as UseQueryOptions<
        Awaited<ReturnType<typeof hentForelopigSvarStatus>>,
        TError,
        TData
    > & {queryKey: QueryKey};
};

export type HentForelopigSvarStatusQueryResult = NonNullable<Awaited<ReturnType<typeof hentForelopigSvarStatus>>>;
export type HentForelopigSvarStatusQueryError = ErrorType<unknown>;

export const useHentForelopigSvarStatus = <
    TData = Awaited<ReturnType<typeof hentForelopigSvarStatus>>,
    TError = ErrorType<unknown>,
>(
    fiksDigisosId: string,
    options?: {
        query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof hentForelopigSvarStatus>>, TError, TData>>;
        request?: SecondParameter<typeof axiosInstance>;
    }
): UseQueryResult<TData, TError> & {queryKey: QueryKey} => {
    const queryOptions = getHentForelopigSvarStatusQueryOptions(fiksDigisosId, options);

    const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {queryKey: QueryKey};

    query.queryKey = queryOptions.queryKey;

    return query;
};
