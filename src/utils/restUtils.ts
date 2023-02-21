import "whatwg-fetch";
import {v4 as uuidv4} from "uuid";
import {axiosInstance} from "../axios-instance";
import {createLogEntry, LOG_URL} from "../redux/innsynsdata/loggActions";

export function isProd(origin: string) {
    return origin.indexOf("www.nav.no") >= 0;
}

export function isLocalhost(origin: string) {
    return origin.indexOf("localhost") >= 0;
}

export function isDevSbs(origin: string): boolean {
    return origin.indexOf("www-q") >= 0;
}

export function isDev(origin: string): boolean {
    return origin.indexOf("digisos.dev.nav.no") >= 0;
}

export function isMock(origin: string): boolean {
    return origin.indexOf("digisos.ekstern.dev.nav.no") >= 0;
}

export function isUsingMockAlt(origin: string): boolean {
    return isMock(origin);
}

export function getApiBaseUrl(excludeApiV1?: boolean): string {
    return getBaseUrl(window.location.origin, excludeApiV1);
}

export function getBaseUrl(origin: string, excludeApiV1?: boolean): string {
    if (isLocalhost(origin)) {
        if (excludeApiV1) {
            return "http://localhost:8989/sosialhjelp/mock-alt-api/login-api/sosialhjelp/innsyn-api";
        }
        return "http://localhost:8989/sosialhjelp/mock-alt-api/login-api/sosialhjelp/innsyn-api/api/v1";
    }
    if (isUsingMockAlt(origin)) {
        if (excludeApiV1) {
            return (
                origin.replace("/sosialhjelp/innsyn", "").replace("sosialhjelp-innsyn", "sosialhjelp-innsyn-api") +
                "/sosialhjelp/mock-alt-api/login-api/sosialhjelp/innsyn-api"
            );
        }
        return (
            origin.replace("/sosialhjelp/innsyn", "").replace("sosialhjelp-innsyn", "sosialhjelp-innsyn-api") +
            "/sosialhjelp/mock-alt-api/login-api/sosialhjelp/innsyn-api/api/v1"
        );
    } else if (isDevSbs(origin) || isDev(origin)) {
        if (excludeApiV1) {
            return (
                origin.replace("/sosialhjelp/innsyn", "").replace("sosialhjelp-innsyn", "sosialhjelp-login-api") +
                "/sosialhjelp/login-api/innsyn-api"
            );
        }
        return (
            origin.replace("/sosialhjelp/innsyn", "").replace("sosialhjelp-innsyn", "sosialhjelp-login-api") +
            "/sosialhjelp/login-api/innsyn-api/api/v1"
        );
    }
    if (excludeApiV1) {
        return "https://www.nav.no/sosialhjelp/login-api/innsyn-api";
    }
    return "https://www.nav.no/sosialhjelp/login-api/innsyn-api/api/v1";
}

export function getNavUrl(origin: string): string {
    if (isLocalhost(origin) || isUsingMockAlt(origin) || isDevSbs(origin) || isDev(origin)) {
        return "https://www.dev.nav.no/person/dittnav/";
    } else {
        return "https://www.nav.no/person/dittnav/";
    }
}

export function getLogoutUrl(origin: string): string {
    if (isLocalhost(origin)) {
        return "http://localhost:3000/sosialhjelp/mock-alt/";
    }
    if (isUsingMockAlt(origin)) {
        return "https://digisos.ekstern.dev.nav.no/sosialhjelp/mock-alt/";
    }
    if (isDevSbs(origin) || isDev(origin)) {
        return "https://loginservice.dev.nav.no/slo";
    }
    return "https://loginservice.nav.no/slo";
}

enum RequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export enum REST_STATUS {
    OK = "OK",
    FEILET = "FEILET",
    PENDING = "PENDING",
    INITIALISERT = "INITIALISERT",
    UNAUTHORIZED = "UNAUTHORIZED",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
}

export const getHeaders = (contentType?: string, callId?: string) => {
    return getOriginAwareHeaders(window.location.origin, contentType, callId);
};

export const getOriginAwareHeaders = (origin: string, contentType?: string, callId?: string): Headers => {
    let headers = new Headers({
        Accept: "application/json, text/plain, */*",
        "Nav-Call-Id": callId ?? generateCallId(),
    });

    if (!contentType || contentType !== "multipart/form-data") {
        headers.append("Content-Type", contentType ? contentType : "application/json; charset=utf-8");
    }

    return headers;
};

export function generateCallId(): string {
    let randomNr = uuidv4();
    let systemTime = Date.now();

    return `CallId_${systemTime}_${randomNr}`;
}

const getCookie = (name: string): string | null => {
    if (!document.cookie) {
        return null;
    }

    const xsrfCookies = document.cookie
        .split(";")
        .map((c) => c.trim())
        .filter((c) => c.startsWith(name + "="));

    if (xsrfCookies.length === 0) {
        return null;
    }
    return decodeURIComponent(xsrfCookies[0].split("=")[1]);
};

export enum HttpErrorType {
    UNAUTHORIZED = "unauthorized",
    UNAUTHORIZED_LOOP = "unauthorized_loop",
    FORBIDDEN = "Forbidden",
    SERVICE_UNAVAILABLE = "Service Unavailable",
    NOT_FOUND = "Not found",
}

function addXsrfHeadersIfPutOrPost(method: string, headers: Headers) {
    if (method === RequestMethod.PUT || method === RequestMethod.POST) {
        const cookie = getCookie("XSRF-TOKEN-INNSYN-API");
        if (cookie !== null) {
            headers.append("XSRF-TOKEN-INNSYN-API", cookie);
        }
    }
}

export const serverRequest = <T>(
    method: string,
    urlPath: string,
    body: string | null | FormData,
    contentType?: string,
    callId?: string
): Promise<T> => {
    const headers = getHeaders(contentType, callId);
    addXsrfHeadersIfPutOrPost(method, headers);
    const OPTIONS: RequestInit = {
        headers: headers,
        method: method,
        credentials: determineCredentialsParameter(),
        body: body ? body : undefined,
    };

    const url = getApiBaseUrl() + urlPath;

    return new Promise((resolve, reject) => {
        fetch(url, OPTIONS)
            .then((response: Response) => {
                sjekkStatuskode(response, url);
                const jsonResponse = toJson<T>(response);
                resolve(jsonResponse);
            })
            .catch((reason: any) => {
                // @ts-ignore
                reason.navCallId = OPTIONS.headers.get("Nav-Call-Id");
                reject(reason);
            });
    });
};

export const serverRequestGetErrors = (
    method: string,
    urlPath: string,
    body: string | null | FormData,
    contentType?: string
) => {
    const headers = getHeaders(contentType);
    addXsrfHeadersIfPutOrPost(method, headers);
    const OPTIONS: RequestInit = {
        headers: headers,
        method: method,
        credentials: determineCredentialsParameter(),
        body: body ? body : undefined,
    };

    const url = getApiBaseUrl() + urlPath;

    return fetch(url, OPTIONS).then(toJson);
};

export function toJson<T>(response: Response): Promise<T> {
    if (response.status === 204) {
        return response.text() as Promise<any>;
    }
    return response.json();
}

function sjekkStatuskode(response: Response, url: string) {
    if (loggGotUnauthorizedDuringLoginProcess(url, response.status)) {
        // 401 ved kall mot /logg under en påloggingsloop kan føre til en uendelig loop. Sender brukeren til feilsiden.
        throw new Error(HttpErrorType.UNAUTHORIZED_LOOP);
    }

    if (response.status === 401) {
        response.json().then((r) => {
            if (window.location.search.split("login_id=")[1] !== r.id) {
                const queryDivider = r.loginUrl.includes("?") ? "&" : "?";
                window.location.href = r.loginUrl + queryDivider + getRedirectPath() + "%26login_id=" + r.id;
            } else {
                axiosInstance({
                    url: getApiBaseUrl() + LOG_URL,
                    method: "post",
                    data: createLogEntry(
                        "Fetch ga 401-error-id selv om kallet ble sendt fra URL med samme login_id (" +
                            r.id +
                            "). Dette kan komme av en påloggingsloop (UNAUTHORIZED_LOOP_ERROR).",
                        "WARN"
                    ),
                })
                    .then(() => {})
                    .catch(() => {
                        return; // Not important to handle those errors
                    });
            }
        });
        throw new Error(HttpErrorType.UNAUTHORIZED);
    }
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    if (response.status === 404) {
        throw new Error(HttpErrorType.NOT_FOUND);
    }
    throw new Error(response.statusText);
}

const loggGotUnauthorizedDuringLoginProcess = (restUrl: string, restStatus: number) => {
    const restUrlIsLogg = restUrl.indexOf("logg") > -1;
    const restStatusIsUnauthorized = restStatus === 401;
    const loginIsProcessing = window.location.search.indexOf("login_id") > -1;
    return restUrlIsLogg && restStatusIsUnauthorized && loginIsProcessing;
};

function determineCredentialsParameter() {
    return isLocalhost(window.location.origin) || isUsingMockAlt(window.location.origin) ? "include" : "same-origin";
}

export function fetchToJson<T>(urlPath: string) {
    return serverRequest<T>(RequestMethod.GET, urlPath, null);
}

export function fetchPut<T>(urlPath: string, body: string) {
    return serverRequest<T>(RequestMethod.PUT, urlPath, body);
}

export function fetchPost<T>(urlPath: string, body: string | FormData, contentType?: string, callId?: string) {
    return serverRequest<T>(RequestMethod.POST, urlPath, body, contentType, callId);
}

export function fetchPostGetErrors(urlPath: string, body: string | FormData, contentType?: string) {
    return serverRequestGetErrors(RequestMethod.POST, urlPath, body, contentType);
}

function getRedirectOrigin() {
    /* Vi endrer preprod-url til www-q*.dev.nav.no (pga naisdevice).
     * Men den gamle URL-en (www-q*.nav.no) vil bli benyttet en stund av kommuner.
     * Loginservice kan kun sette cookies på apper som kjører på samme domene.
     * Vi lar derfor loginservice redirecte til den nye ingressen. */
    return window.location.origin;
}

export function getRedirectPath(): string {
    const redirectOrigin = getRedirectOrigin();
    const gotoParameter = "?goto=" + window.location.pathname;
    const redirectPath = redirectOrigin + "/sosialhjelp/innsyn/link" + gotoParameter;
    return "redirect=" + redirectPath;
}

export function skalViseLastestripe(restStatus: REST_STATUS, menIkkeVedFeil?: boolean): boolean {
    return (
        restStatus === REST_STATUS.PENDING ||
        restStatus === REST_STATUS.INITIALISERT ||
        (restStatus === REST_STATUS.FEILET && !menIkkeVedFeil)
    );
}
