import "whatwg-fetch";
import uuid from "uuid";
import {logErrorMessage} from "../redux/innsynsdata/loggActions";

export function isDev(origin: string) {
    return origin.indexOf("localhost") >= 0;
}

export function isQ(origin: string): boolean {
    return (
        origin.indexOf("www-q") >= 0 ||
        (origin.indexOf("sosialhjelp-innsyn-q") >= 0 && origin.indexOf("dev-sbs.nais.io") >= 0)
    );
}

export function isQ1(origin: string): boolean {
    return isQ(origin) && origin.indexOf("-q1") >= 0;
}

export function isDevGcp(origin: string): boolean {
    return origin.indexOf(".dev.nav.no") > 0;
}

export function isLabsGcpWithProxy(origin: string): boolean {
    return origin.indexOf("digisos.labs.nais.io") >= 0;
}

export function isLabsGcpWithoutProxy(origin: string): boolean {
    return origin.indexOf("innsyn.labs.nais.io") > 0;
}

export function isMockServer(origin: string): boolean {
    return isLabsGcpWithoutProxy(origin) || isLabsGcpWithProxy(origin) || isDevGcp(origin);
}

export function erMedLoginApi(): boolean {
    // return true; // Uncomment om testing via login-api
    return false;
}

export function getApiBaseUrl(): string {
    return getBaseUrl(window.location.origin);
}

export function getBaseUrl(origin: string): string {
    if (isDev(origin)) {
        if (erMedLoginApi()) {
            return "http://localhost:7000/sosialhjelp/login-api/innsyn-api/api/v1";
        }
        return "http://localhost:8080/sosialhjelp/innsyn-api/api/v1";
    }
    if (isQ(origin) || isDevGcp(origin) || isLabsGcpWithProxy(origin) || isLabsGcpWithoutProxy(origin)) {
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
    if (isDev(origin)) {
        return "http://localhost:8181/sosialhjelp/soknad-api";
    }
    if (isQ(origin) || isDevGcp(origin) || isLabsGcpWithProxy(origin) || isLabsGcpWithoutProxy(origin)) {
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
    if (isQ1(origin)) {
        return "https://www-q1.nav.no/person/dittnav/";
    }
    if (
        isDev(origin) ||
        isDevGcp(origin) ||
        isLabsGcpWithProxy(origin) ||
        isLabsGcpWithoutProxy(origin) ||
        isQ(origin)
    ) {
        return "https://www-q0.nav.no/person/dittnav/";
    } else {
        return "https://www.nav.no/person/dittnav/";
    }
}

export function getApiBaseUrlForSwagger(): string {
    return getApiUrlForSwagger(window.location.origin);
}

export function getApiUrlForSwagger(origin: string): string {
    if (isDev(origin)) {
        return "http://localhost:8080/sosialhjelp/innsyn-api/swagger-ui.html";
    }
    if (
        isDev(origin) ||
        isDevGcp(origin) ||
        isLabsGcpWithProxy(origin) ||
        isLabsGcpWithoutProxy(origin) ||
        isQ(origin)
    ) {
        return (
            origin.replace("/sosialhjelp/innsyn", "").replace("sosialhjelp-innsyn", "sosialhjelp-innsyn-api") +
            "/sosialhjelp/innsyn-api/swagger-ui.html"
        );
    }
    return ""; // No swagger in prod
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

export const getHeaders = (contentType?: string) => {
    let headers = new Headers({
        "Content-Type": contentType ? contentType : "application/json; charset=utf-8",
        Accept: "application/json, text/plain, */*",
        "Nav-Call-Id": generateCallId(),
    });
    // Browser setter content type header automatisk til multipart/form-data: boundary xyz
    if (contentType && contentType === "multipart/form-data") {
        headers = new Headers({
            Accept: "application/json, text/plain, */*",
            "Nav-Call-Id": generateCallId(),
        });
    }

    if (isMockServer(window.location.origin) || (isDev(window.location.origin) && !erMedLoginApi())) {
        headers.append("Authorization", "dummytoken");
    }
    return headers;
};

function generateCallId(): string {
    let randomNr = uuid.v4();
    let systemTime = Date.now();

    return `CallId_${systemTime}_${randomNr}`;
}

export enum HttpStatus {
    UNAUTHORIZED = "unauthorized",
    SERVICE_UNAVAILABLE = "Service Unavailable",
}

export const serverRequest = (
    method: string,
    urlPath: string,
    body: string | null | FormData,
    contentType?: string,
    isSoknadApi?: boolean
) => {
    const OPTIONS: RequestInit = {
        headers: getHeaders(contentType),
        method: method,
        credentials: determineCredentialsParameter(),
        body: body ? body : undefined,
    };

    const url = isSoknadApi ? getSoknadApiUrl() + urlPath : getApiBaseUrl() + urlPath;

    return new Promise((resolve, reject) => {
        fetch(url, OPTIONS)
            .then((response: Response) => {
                sjekkStatuskode(response);
                const jsonResponse = toJson(response);
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
    const OPTIONS: RequestInit = {
        headers: getHeaders(contentType),
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

function sjekkStatuskode(response: Response) {
    if (response.status === 401) {
        response.json().then((r) => {
            if (window.location.search.split("login_id=")[1] !== r.id) {
                const queryDivider = r.loginUrl.includes("?") ? "&" : "?";
                window.location.href = r.loginUrl + queryDivider + getRedirectPath() + "%26login_id=" + r.id;
            } else {
                logErrorMessage(
                    "Fetch ga 401-error-id selv om kallet ble sendt fra URL med samme login_id (" +
                        r.id +
                        "). Dette kan komme av en påloggingsloop (UNAUTHORIZED_LOOP_ERROR)."
                );
            }
        });
        throw new Error(HttpStatus.UNAUTHORIZED);
    }
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    throw new Error(response.statusText);
}

function determineCredentialsParameter() {
    return window.location.origin.indexOf("nais.oera") ||
        isDev(window.location.origin) ||
        isMockServer(window.location.origin)
        ? "include"
        : "same-origin";
}

export function fetchToJson(urlPath: string) {
    return serverRequest(RequestMethod.GET, urlPath, null);
}

export function fetchToJsonFromSoknadApi(urlPath: string) {
    return serverRequest(RequestMethod.GET, urlPath, null, undefined, true);
}

export function fetchPut(urlPath: string, body: string) {
    return serverRequest(RequestMethod.PUT, urlPath, body);
}

export function fetchPost(urlPath: string, body: string | FormData, contentType?: string) {
    return serverRequest(RequestMethod.POST, urlPath, body, contentType);
}

export function fetchPostGetErrors(urlPath: string, body: string | FormData, contentType?: string) {
    return serverRequestGetErrors(RequestMethod.POST, urlPath, body, contentType);
}

export function fetchDelete(urlPath: string) {
    const OPTIONS: RequestInit = {
        headers: getHeaders(),
        method: RequestMethod.DELETE,
    };
    return fetch(getApiBaseUrl() + urlPath, OPTIONS).then(sjekkStatuskode);
}

export function getRedirectPath(): string {
    const currentOrigin = window.location.origin;
    const gotoParameter = "?goto=" + window.location.pathname;
    const redirectPath = currentOrigin + "/sosialhjelp/innsyn/link" + gotoParameter;
    return "redirect=" + redirectPath;
}

export function skalViseLastestripe(restStatus: REST_STATUS, menIkkeVedFeil?: boolean): boolean {
    return (
        restStatus === REST_STATUS.PENDING ||
        restStatus === REST_STATUS.INITIALISERT ||
        (restStatus === REST_STATUS.FEILET && !menIkkeVedFeil)
    );
}
