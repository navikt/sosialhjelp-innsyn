import Axios, {AxiosError, AxiosRequestConfig, isCancel} from "axios";
import {
    generateCallId,
    getApiBaseUrl,
    getRedirectPath,
    HttpErrorType,
    isLocalhost,
    isUsingMockAlt,
    loggGotUnauthorizedDuringLoginProcess,
} from "./utils/restUtils";
import {logWarningMessage} from "./redux/innsynsdata/loggActions";

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
        .catch(async (e) => {
            Object.assign(e, {navCallId: e.config?.headers["Nav-Call-Id"]});

            if (!(e instanceof AxiosError<T>)) {
                logWarningMessage(`non-axioserror error ${e} in axiosinstance`, e.navCallId);
            }

            if (isCancel(e)) return new Promise<T>(() => {});

            if (!e.response) {
                logWarningMessage(`Nettverksfeil i axiosInstance: ${config.method} ${config.url} ${e}`, e.navCallId);
                throw e;
            }

            const {status, data} = e.response;

            if (loggGotUnauthorizedDuringLoginProcess(config.url ?? "", status)) {
                // 401 ved kall mot /logg under en påloggingsloop kan føre til en uendelig loop. Sender brukeren til feilsiden.
                throw new Error(HttpErrorType.UNAUTHORIZED_LOOP, e);
            }

            if (status === 401) {
                if (window.location.search.split("login_id=")[1] !== data.id) {
                    const queryDivider = data.loginUrl.includes("?") ? "&" : "?";
                    window.location.href = data.loginUrl + queryDivider + getRedirectPath(data.loginUrl, data.id);
                } else {
                    logWarningMessage(
                        "Fetch ga 401-error-id selv om kallet ble sendt fra URL med samme login_id (" +
                            data.id +
                            "). Dette kan komme av en påloggingsloop (UNAUTHORIZED_LOOP_ERROR).",
                        e.navCallId
                    );
                }

                throw new Error(HttpErrorType.UNAUTHORIZED, e);
            }

            if (status === 404) {
                throw new Error(HttpErrorType.NOT_FOUND, e);
            }

            logWarningMessage(`Nettverksfeil i axiosInstance: ${config.method} ${config.url}: ${status} ${data}`);
            throw e;
        });

    // @ts-ignore
    promise.cancel = () => {
        source.cancel("Query was cancelled");
    };

    return promise;
};

export type ErrorType<Error> = AxiosError<Error> & {navCallId?: string};
