import 'whatwg-fetch'

export function erDev(): boolean {
    const url = window.location.href;
    return (url.indexOf("localhost:3000") > 0);
}

export function erMockServer(): boolean {
    const url = window.location.origin;
    return (url.indexOf("heroku") > 0) || (url.indexOf("digisos-test") > 0) || (url.indexOf("dev-nav.no") > 0) || (url.indexOf("labs.nais.io") > 0);
}

export function erMedLoginApi(): boolean {
    // return true; // Uncomment om testing via login-api
    return false
}

export function getApiBaseUrl(): string {
    if (erDev()) {
        if (erMedLoginApi()) {
            return "http://localhost:7000/sosialhjelp/login-api/innsyn-api/api/v1";
        }
        return "http://localhost:8080/sosialhjelp/innsyn-api/api/v1";
    } else if (window.location.origin.indexOf(".dev-nav.no") >= 0) {
        return window.location.origin.replace(".dev-nav.no", "-api.dev-nav.no") + "/sosialhjelp/innsyn-api/api/v1";
    } else if (window.location.origin.indexOf(".labs.nais.io") >= 0) {
        if (window.location.origin.indexOf("digisos.labs.nais.io") >= 0) {
            return getAbsoluteApiUrl() + "api/v1"
        }
        return window.location.origin.replace(".labs.nais.io", "-api.labs.nais.io") + "/sosialhjelp/innsyn-api/api/v1";
    } else {
        return getAbsoluteApiUrl() + "api/v1"
    }
}

export function getApiBaseUrlForSwagger(): string {
    if (erDev()) {
        return "http://localhost:8080/sosialhjelp/innsyn-api/swagger-ui.html";
    } else {
        return getAbsoluteApiUrl() + "swagger-ui.html";
    }
}

/**
 * Resolves API URL in a pathname independent way
 */
function getAbsoluteApiUrl() {
    return window.location.pathname.replace(/^(\/([^/]+\/)?sosialhjelp\/)innsyn.+$/, "$1login-api/innsyn-api/")
}

enum RequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export enum REST_STATUS {
    OK = "OK",
    FEILET = "FEILET",
    PENDING = "PENDING",
    INITIALISERT = "INITIALISERT",
    UNAUTHORIZED = "UNAUTHORIZED",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
}

export const getHeaders = (contentType?: string) => {
    let headers = new Headers({
        "Content-Type": (contentType ? contentType : "application/json"),
        "Accept": "application/json, text/plain, */*"
    });
    // Browser setter content type header automatisk til multipart/form-data: boundary xyz
    if (contentType && contentType === "multipart/form-data") {
        headers = new Headers({
            "Accept": "application/json, text/plain, */*"
        });
    }

    if (erMockServer() || (erDev() && !erMedLoginApi())) {
        headers.append("Authorization", "dummytoken")
    }
    return headers;
};

export enum HttpStatus {
    UNAUTHORIZED = "unauthorized",
    SERVICE_UNAVAILABLE = "Service Unavailable",
}

export const serverRequest = (method: string, urlPath: string, body: string|null|FormData, contentType?: string) => {
    const OPTIONS: RequestInit = {
        headers: getHeaders(contentType),
        method: method,
        credentials: determineCredentialsParameter(),
        body: body ? body : null
    };

    return new Promise((resolve, reject) => {
        fetch(getApiBaseUrl() + urlPath, OPTIONS)
            .then((response: Response) => {
                sjekkStatuskode(response);
                const jsonResponse = toJson(response);
                resolve(jsonResponse);
            })
            .catch((reason: any) => reject(reason));
    });
};

export function toJson<T>(response: Response): Promise<T> {
    if (response.status === 204) {
        return response.text() as Promise<any>;
    }
    return response.json();
}

function sjekkStatuskode(response: Response) {
    if (response.status === 401){
        console.warn("Bruker er ikke logget inn.");
        response.json().then(r => {
            if (window.location.search.split("error_id=")[1] !== r.id) {
                const queryDivider = r.loginUrl.includes("?") ? "&" : "?";
                const redirectUrl = r.loginUrl + queryDivider + getRedirectPath() + "%26error_id=" + r.id;
                console.warn("Redirect til " + redirectUrl);
                window.location.href = redirectUrl;
            } else {
                // TODO: må sende log til server (se sosialhjelp-soknad)
                console.error("Fetch ga 401-error-id selv om kallet ble sendt fra URL med samme error_id (" + r.id + "). Dette kan komme av en påloggingsloop (UNAUTHORIZED_LOOP_ERROR).");
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
    return window.location.origin.indexOf("nais.oera") || erDev() || erMockServer() ? "include" : "same-origin";
}

export function fetchToJson(urlPath: string) {
    return serverRequest(RequestMethod.GET, urlPath, null);
}

export function fetchPut(urlPath: string, body: string) {
    return serverRequest(RequestMethod.PUT, urlPath, body);
}

export function fetchPost(urlPath: string, body: string|FormData, contentType?: string) {
    return serverRequest(RequestMethod.POST, urlPath, body, contentType);
}

export function fetchDelete(urlPath: string) {
    const OPTIONS: RequestInit = {
        headers: getHeaders(),
        method: RequestMethod.DELETE
    };
    return fetch(getApiBaseUrl() + urlPath, OPTIONS).then(sjekkStatuskode);
}

export function getRedirectPath(): string {
    const currentOrigin = window.location.origin;
    const gotoParameter = "?goto=" + window.location.pathname;
    const redirectPath = currentOrigin + "/sosialhjelp/innsyn/link" + gotoParameter;
    return 'redirect=' + redirectPath;
}
