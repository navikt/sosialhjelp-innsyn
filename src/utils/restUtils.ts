import "whatwg-fetch";
import {logWarningMessage} from "../redux/innsynsdata/loggActions";
import {v4 as uuidv4} from "uuid";

export function isProd(origin: string) {
    return origin.indexOf("www.nav.no") >= 0;
}

export function isLocalhost(origin: string) {
    return origin.indexOf("localhost") >= 0;
}

export function isDevSbs(origin: string): boolean {
    return origin.indexOf("www-q") >= 0 || origin.indexOf("sosialhjelp-innsyn.dev.nav.no") >= 0;
}

export function isDev(origin: string): boolean {
    return origin.indexOf("digisos.dev.nav.no") >= 0;
}

export function isMock(origin: string): boolean {
    return origin.indexOf("digisos.ekstern.dev.nav.no") >= 0;
}

export function isLabs(origin: string): boolean {
    return origin.indexOf("digisos.labs.nais.io") >= 0;
}

export function isUsingMockAlt(origin: string): boolean {
    return isLabs(origin) || isMock(origin);
}

export function getApiBaseUrl(): string {
    return getBaseUrl(window.location.origin);
}

export function getBaseUrl(origin: string): string {
    if (isLocalhost(origin)) {
        return "http://localhost:8080/sosialhjelp/innsyn-api/api/v1";
    }
    if (isUsingMockAlt(origin)) {
        return (
            origin.replace("/sosialhjelp/innsyn", "").replace("sosialhjelp-innsyn", "sosialhjelp-innsyn-api") +
            "/sosialhjelp/mock-alt-api/login-api/sosialhjelp/innsyn-api/api/v1"
        );
    } else if (isDevSbs(origin) || isDev(origin)) {
        return (
            origin.replace("/sosialhjelp/innsyn", "").replace("sosialhjelp-innsyn", "sosialhjelp-login-api") +
            "/sosialhjelp/login-api/innsyn-api/api/v1"
        );
    }
    return "https://www.nav.no/sosialhjelp/login-api/innsyn-api/api/v1";
}

export function getSoknadApiUrl(): string {
    return getSoknadBaseUrl(window.location.origin);
}

export function getSoknadBaseUrl(origin: string): string {
    if (isLocalhost(origin)) {
        return "http://localhost:8181/sosialhjelp/soknad-api";
    }
    if (isDevSbs(origin) || isUsingMockAlt(origin) || isDev(origin)) {
        return (
            origin.replace("/sosialhjelp/innsyn", "").replace("sosialhjelp-innsyn", "sosialhjelp-soknad-api") +
            "/sosialhjelp/soknad-api"
        );
    }
    return "https://www.nav.no/sosialhjelp/soknad-api";
}

export function getDittNavUrl(): string {
    return getNavUrl(window.location.origin);
}

export function getNavUrl(origin: string): string {
    if (isLocalhost(origin) || isUsingMockAlt(origin) || isDevSbs(origin) || isDev(origin)) {
        return "https://www.dev.nav.no/person/dittnav/";
    } else {
        return "https://www.nav.no/person/dittnav/";
    }
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

function generateCallId(): string {
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
    isSoknadApi?: boolean,
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

    const url = isSoknadApi ? getSoknadApiUrl() + urlPath : getApiBaseUrl() + urlPath;

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
    contentType?: string,
    isSoknadApi?: boolean
) => {
    const headers = getHeaders(contentType);
    addXsrfHeadersIfPutOrPost(method, headers);
    const OPTIONS: RequestInit = {
        headers: headers,
        method: method,
        credentials: determineCredentialsParameter(),
        body: body ? body : undefined,
    };

    const url = isSoknadApi ? getSoknadApiUrl() + urlPath : getApiBaseUrl() + urlPath;

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
                window.location.href = r.loginUrl + queryDivider + getRedirectPath(); // + "%26login_id=" + r.id;
            } else {
                logWarningMessage(
                    "Fetch ga 401-error-id selv om kallet ble sendt fra URL med samme login_id (" +
                        r.id +
                        "). Dette kan komme av en påloggingsloop (UNAUTHORIZED_LOOP_ERROR)."
                );
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
    return window.location.origin.indexOf("nais.oera") ||
        isLocalhost(window.location.origin) ||
        isUsingMockAlt(window.location.origin)
        ? "include"
        : "same-origin";
}

export function fetchToJson<T>(urlPath: string) {
    return serverRequest<T>(RequestMethod.GET, urlPath, null);
}

export function fetchToJsonFromSoknadApi<T>(urlPath: string) {
    return serverRequest<T>(RequestMethod.GET, urlPath, null, undefined, true);
}

export function fetchPut<T>(urlPath: string, body: string) {
    return serverRequest<T>(RequestMethod.PUT, urlPath, body);
}

export function fetchPost<T>(urlPath: string, body: string | FormData, contentType?: string, callId?: string) {
    return serverRequest<T>(RequestMethod.POST, urlPath, body, contentType, undefined, callId);
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
    const redirectPath = "goto=" + redirectOrigin + window.location.pathname;
    // const redirectPath = redirectOrigin + "/sosialhjelp/innsyn/link" + gotoParameter;
    return redirectPath;
}

export function skalViseLastestripe(restStatus: REST_STATUS, menIkkeVedFeil?: boolean): boolean {
    return (
        restStatus === REST_STATUS.PENDING ||
        restStatus === REST_STATUS.INITIALISERT ||
        (restStatus === REST_STATUS.FEILET && !menIkkeVedFeil)
    );
}
