/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {useMutation} from "@tanstack/react-query";
import type {MutationFunction, UseMutationOptions, UseMutationResult} from "@tanstack/react-query";
import type {Logg} from ".././model";
import {customFetch} from "../../custom-fetch";

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

export const getPostKlientloggUrl = () => {
    return `/sosialhjelp/innsyn/api/innsyn-api/api/v1/info/logg`;
};

export const postKlientlogg = async (logg: Logg, options?: RequestInit): Promise<void> => {
    return customFetch<Promise<void>>(getPostKlientloggUrl(), {
        ...options,
        method: "POST",
        headers: {"Content-Type": "application/json", ...options?.headers},
        body: JSON.stringify(logg),
    });
};

export const getPostKlientloggMutationOptions = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof postKlientlogg>>, TError, {data: Logg}, TContext>;
    request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<Awaited<ReturnType<typeof postKlientlogg>>, TError, {data: Logg}, TContext> => {
    const {mutation: mutationOptions, request: requestOptions} = options ?? {};

    const mutationFn: MutationFunction<Awaited<ReturnType<typeof postKlientlogg>>, {data: Logg}> = (props) => {
        const {data} = props ?? {};

        return postKlientlogg(data, requestOptions);
    };

    return {mutationFn, ...mutationOptions};
};

export type PostKlientloggMutationResult = NonNullable<Awaited<ReturnType<typeof postKlientlogg>>>;
export type PostKlientloggMutationBody = Logg;
export type PostKlientloggMutationError = unknown;

export const usePostKlientlogg = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof postKlientlogg>>, TError, {data: Logg}, TContext>;
    request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<Awaited<ReturnType<typeof postKlientlogg>>, TError, {data: Logg}, TContext> => {
    const mutationOptions = getPostKlientloggMutationOptions(options);

    return useMutation(mutationOptions);
};
