import Axios, {AxiosRequestConfig} from "axios";
import {generateCallId, getApiBaseUrl, isLocalhost, isUsingMockAlt} from "./utils/restUtils";

export const AXIOS_INSTANCE = Axios.create({
    baseURL: getApiBaseUrl(true),
    xsrfCookieName: "XSRF-TOKEN-INNSYN-API",
    withCredentials: isLocalhost(window.location.origin) || isUsingMockAlt(window.location.origin),
    xsrfHeaderName: "XSRF-TOKEN-INNSYN-API",
    headers: {
        "nav-call-id": generateCallId(),
        Accept: "application/json, text/plain, */*",
    },
});

export const axiosInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then(({data}) => data);

    // @ts-ignore
    promise.cancel = () => {
        source.cancel("Query was cancelled");
    };

    return promise;
};
