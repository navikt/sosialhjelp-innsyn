import Axios, {AxiosError, AxiosRequestConfig, isCancel} from "axios";
import {generateCallId, getRedirectPath, HttpErrorType, isLocalhost, isUsingMockAlt} from "./utils/restUtils";
import {logger} from "@navikt/next-logger";

export const AXIOS_INSTANCE = Axios.create({
    xsrfCookieName: "XSRF-TOKEN-INNSYN-API",
    xsrfHeaderName: "XSRF-TOKEN-INNSYN-API",
    headers: {
        "Nav-Call-Id": generateCallId(),
        Accept: "application/json, text/plain, */*",
    },
    withCredentials: isLocalhost() || isUsingMockAlt(),
    baseURL: process.env.NEXT_PUBLIC_INNSYN_API_BASE_URL,
});

interface CustomConfig {
    isServerSide?: boolean;
}

export const axiosInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig & CustomConfig
): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    })
        .then(({data}) => data)
        .catch(async (e) => {
            Object.assign(e, {navCallId: e.config?.headers["Nav-Call-Id"]});

            if (!(e instanceof AxiosError<T>)) {
                logger.warn(`non-axioserror error ${e} in axiosinstance`, e.navCallId);
            }

            if (isCancel(e)) return new Promise<T>(() => {});

            if (!e.response) {
                logger.warn(`Nettverksfeil i axiosInstance: ${config.method} ${config.url} ${e}`, e.navCallId);
                throw e;
            }

            const {status, data} = e.response;

            logger.warn(
                `Nettverksfeil i axiosInstance: ${config.method} ${config.url}: ${status} ${data}`,
                e.navCallId
            );
            throw e;
        });

    // @ts-ignore
    promise.cancel = () => {
        source.cancel("Query was cancelled");
    };

    return promise;
};

export type ErrorType<Error> = AxiosError<Error> & {navCallId?: string};
