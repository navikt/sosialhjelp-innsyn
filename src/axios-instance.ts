import Axios, {AxiosError, AxiosRequestConfig} from "axios";
import {generateCallId, getApiBaseUrl, isLocalhost, isUsingMockAlt} from "./utils/restUtils";

export const AXIOS_INSTANCE = Axios.create({
    baseURL: getApiBaseUrl(true),
    xsrfCookieName: "XSRF-TOKEN-INNSYN-API",
    withCredentials: isLocalhost(window.location.origin) || isUsingMockAlt(window.location.origin),
    xsrfHeaderName: "XSRF-TOKEN-INNSYN-API",
    headers: {
        "Nav-Call-Id": generateCallId(),
        Accept: "application/json, text/plain, */*",
    },
});

export const axiosInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    })
        .then(({data}) => data)
        .catch((error: AxiosError<Error>) => {
            // @ts-ignore
            Object.assign(error, {navCallId: error.config?.headers["Nav-Call-Id"]});
            throw error;
        });

    // @ts-ignore
    promise.cancel = () => {
        source.cancel("Query was cancelled");
    };

    return promise;
};

export type ErrorType<Error> = AxiosError<Error> & {navCallId?: string};
