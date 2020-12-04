import "whatwg-fetch";
import {logWarningMessage} from "../redux/innsynsdata/loggActions";
import {v4 as uuidv4} from "uuid";

const sessionTraceID = uuidv4().toString().replace(/-/g, "");

export function isProd(origin: string) {
    return origin.indexOf("www.nav.no") >= 0;
}

export function isLocalhost(origin: string) {
    return origin.indexOf("localhost") >= 0;
}

export function isDevSbs(origin: string): boolean {
    return (
        origin.indexOf("www-q") >= 0 ||
        origin.indexOf("sosialhjelp-innsyn.dev.nav.no") >= 0 ||
        origin.indexOf("sosialhjelp-innsyn-intern.dev.nav.no") >= 0
    );
}

export function isQ1(origin: string): boolean {
    return isDevSbs(origin) && (origin.indexOf("-q1") >= 0 || origin.indexOf("-intern") >= 0);
}

export function isQGammelVersjon(origin: string): boolean {
    /* Vi endrer url til www-q*.dev.nav.no. Denne funksjonen returnerer true når den gamle URL-en blir benyttet.
     * Den gamle URL-en vil bli benyttet en stund av kommuner. */
    return origin.indexOf("www-q0.nav.no") >= 0 || origin.indexOf("www-q1.nav.no") >= 0;
}

export function isDevGcpWithProxy(origin: string): boolean {
    return origin.indexOf("digisos-gcp.dev.nav.no") >= 0;
}

export function isDevGcpWithoutProxy(origin: string): boolean {
    return origin.indexOf("innsyn-gcp.dev.nav.no") >= 0;
}

export function isLabsGcpWithProxy(origin: string): boolean {
    return origin.indexOf("digisos.labs.nais.io") >= 0;
}

export function isLabsGcpWithoutProxy(origin: string): boolean {
    return origin.indexOf("innsyn.labs.nais.io") >= 0;
}

export function isMockServer(origin: string): boolean {
    return (
        isLabsGcpWithoutProxy(origin) ||
        isLabsGcpWithProxy(origin) ||
        isDevGcpWithoutProxy(origin) ||
        isDevGcpWithProxy(origin)
    );
}

export function erMedLoginApi(): boolean {
    // return true; // Uncomment om testing via login-api
    return false;
}

export function getApiBaseUrl(): string {
    return getBaseUrl(window.location.origin);
}

export function getBaseUrl(origin: string): string {
    if (isLocalhost(origin)) {
        if (erMedLoginApi()) {
            return "http://localhost:7000/sosialhjelp/login-api/innsyn-api/api/v1";
        }
        return "http://localhost:8080/sosialhjelp/innsyn-api/api/v1";
    }
    if (
        isDevGcpWithoutProxy(origin) ||
        isDevGcpWithProxy(origin) ||
        isLabsGcpWithProxy(origin) ||
        isLabsGcpWithoutProxy(origin)
    ) {
        return (
            origin.replace("/sosialhjelp/innsyn", "").replace("sosialhjelp-innsyn", "sosialhjelp-innsyn-api") +
            "/sosialhjelp/innsyn-api/api/v1"
        );
    } else if (isDevSbs(origin)) {
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
    if (
        isDevSbs(origin) ||
        isDevGcpWithoutProxy(origin) ||
        isDevGcpWithProxy(origin) ||
        isLabsGcpWithProxy(origin) ||
        isLabsGcpWithoutProxy(origin)
    ) {
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
        isLocalhost(origin) ||
        isDevGcpWithProxy(origin) ||
        isDevGcpWithoutProxy(origin) ||
        isLabsGcpWithProxy(origin) ||
        isLabsGcpWithoutProxy(origin) ||
        isDevSbs(origin)
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
    if (isLocalhost(origin)) {
        return "http://localhost:8080/sosialhjelp/innsyn-api/swagger-ui.html";
    }
    if (
        isLocalhost(origin) ||
        isDevGcpWithProxy(origin) ||
        isDevGcpWithoutProxy(origin) ||
        isLabsGcpWithProxy(origin) ||
        isLabsGcpWithoutProxy(origin) ||
        isDevSbs(origin)
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

    if (isMockServer(origin) || (isLocalhost(origin) && !erMedLoginApi())) {
        headers.append("Authorization", "dummytoken");
    }
    if (
        isDevGcpWithoutProxy(origin) ||
        isDevGcpWithProxy(origin) ||
        isLabsGcpWithProxy(origin) ||
        isLabsGcpWithoutProxy(origin)
    ) {
        headers.append("X-B3-TraceId", sessionTraceID.substr(0, 16));
        headers.append("X-B3-SpanId", sessionTraceID.substr(16, 16));
    }
    return headers;
};

function generateCallId(): string {
    let randomNr = uuidv4();
    let systemTime = Date.now();

    return `CallId_${systemTime}_${randomNr}`;
}

export enum HttpErrorType {
    UNAUTHORIZED = "unauthorized",
    UNAUTHORIZED_LOOP = "unauthorized_loop",
    FORBIDDEN = "Forbidden",
    SERVICE_UNAVAILABLE = "Service Unavailable",
}

export const serverRequest = (
    method: string,
    urlPath: string,
    body: string | null | FormData,
    contentType?: string,
    isSoknadApi?: boolean,
    callId?: string
) => {
    const OPTIONS: RequestInit = {
        headers: getHeaders(contentType, callId),
        method: method,
        credentials: determineCredentialsParameter(),
        body: body ? body : undefined,
    };

    const url = isSoknadApi ? getSoknadApiUrl() + urlPath : getApiBaseUrl() + urlPath;

    return new Promise((resolve, reject) => {
        fetch(url, OPTIONS)
            .then((response: Response) => {
                sjekkStatuskode(response, url);
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

export function fetchPost(urlPath: string, body: string | FormData, contentType?: string, callId?: string) {
    return serverRequest(RequestMethod.POST, urlPath, body, contentType, undefined, callId);
}

export function fetchPostGetErrors(urlPath: string, body: string | FormData, contentType?: string) {
    return serverRequestGetErrors(RequestMethod.POST, urlPath, body, contentType);
}

function getRedirectOrigin() {
    /* Vi endrer preprod-url til www-q*.dev.nav.no (pga naisdevice).
     * Men den gamle URL-en (www-q*.nav.no) vil bli benyttet en stund av kommuner.
     * Loginservice kan kun sette cookies på apper som kjører på samme domene.
     * Vi lar derfor loginservice redirecte til den nye ingressen. */

    const currentOrigin = window.location.origin;
    if (isQGammelVersjon(currentOrigin)) {
        return currentOrigin.replace("nav.no", "dev.nav.no");
    }
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
