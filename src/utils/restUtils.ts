import 'whatwg-fetch'

export function erDev(): boolean {
    const url = window.location.href;
    return (url.indexOf("localhost:3000") > 0);
}
export function erHeroku(): boolean {
    const url = window.location.origin;
    return (url.indexOf("heroku") > 0) || (url.indexOf("digisos-test") > 0);
}

export function erMedLoginApi(): boolean {
    return true; // Uncomment om testing via login-api
    // return false
}

export function getApiBaseUrl(): string {
    if (erDev()) {
        if (erMedLoginApi) {
            return "http://localhost:7000/sosialhjelp/login-api/innsyn-api/api/v1/innsyn";
        }
        return "http://localhost:8080/sosialhjelp/innsyn-api/api/v1/innsyn";
    } else {
        return getAbsoluteApiUrl() + "api/v1/innsyn"
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
    UNAUTHORIZED = "UNAUTHORIZED"
}

export const getHeaders = () => {
    let headers = new Headers({
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*"
    });
    if (erHeroku() || (erDev() && !erMedLoginApi())) {
        headers.append("Authorization", "dummytoken")
    }
    console.log("HEADERS: " + headers);
    console.log("HEADERS: " + headers.values());
    return headers;
};

export enum HttpStatus {
    UNAUTHORIZED = "unauthorized",
}

export const serverRequest = (method: string, urlPath: string, body: string|null) => {
    const OPTIONS: RequestInit = {
        headers: getHeaders(),
        credentials: determineCredentialsParameter(),
        method: method,
        body: body ? body : undefined
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
        response.json().then(r => {

            if (window.location.search.split("error_id=")[1] !== r.id) {
                console.log("loginUrl: " + r.loginUrl);
                const queryDivider = r.loginUrl.includes("?") ? "&" : "?";
                window.location.href = r.loginUrl + queryDivider + getRedirectPath() + "%26error_id=" + r.id;
            } else {
                // TODO: må sende log til server (se sosialhjelp-soknad)
                console.log("Fetch ga 401-error-id selv om kallet ble sendt fra URL med samme error_id (" + r.id + "). Dette kan komme av en påloggingsloop (UNAUTHORIZED_LOOP_ERROR).");
            }
        });
        throw new Error(HttpStatus.UNAUTHORIZED);
    }
    if (response.status >= 200 && response.status < 300) {
        return;
    }
    throw new Error(response.statusText);
}

export function getRedirectPath(): string {
    const currentOrigin = window.location.origin;
    const gotoParameter = "?goto=" + window.location.pathname;
    const redirectPath = currentOrigin + getRedirectPathname() + gotoParameter;
    return 'redirect=' + redirectPath;
}
export function getRedirectPathname(): string {
    return `/sosialhjelp/innsyn/link`;
}

function determineCredentialsParameter() {
    return window.location.origin.indexOf("nais.oera") || erDev() || "heroku" ? "include" : "same-origin";
}

export function fetchToJson(urlPath: string) {
    return serverRequest(RequestMethod.GET, urlPath, null);
}

export function fetchPut(urlPath: string, body: string) {
    return serverRequest(RequestMethod.PUT, urlPath, body);
}

export function fetchPost(urlPath: string, body: string) {
    return serverRequest(RequestMethod.POST, urlPath, body);
}

export function fetchDelete(urlPath: string) {
    const OPTIONS: RequestInit = {
        headers: getHeaders(),
        credentials: determineCredentialsParameter(),
        method: RequestMethod.DELETE
    };
    return fetch(getApiBaseUrl() + urlPath, OPTIONS).then(sjekkStatuskode);
}

