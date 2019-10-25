import 'whatwg-fetch'

export function erDev(): boolean {
    const url = window.location.href;
    return (url.indexOf("localhost:3000") > 0);
}

export function getApiBaseUrl(): string {
    if (erDev()) {
        return "http://localhost:8080/sosialhjelp/innsyn-api/api/v1";
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
    INITIALISERT = "INITIALISERT"
}

const getHeaders = () => {
    return new Headers({
        "Content-Type": "application/json",
        "Authorization": "Bearer 1234", // FIXME: Ikke hardkodet Authorization id
        // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN-SOKNAD-API"),
        "Accept": "application/json, text/plain, */*"
    });
};

export const serverRequest = (method: string, urlPath: string, body: string|null|FormData) => {
    const OPTIONS: RequestInit = {
        headers: getHeaders(),
        method,
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
        console.warn("Bruker er ikke logget inn.");
        response.json().then(r => {
            window.location.href = r.loginUrl + "?redirect=" + encodeURI(window.location.origin + "/sosialhjelp/innsyn/link&goto=" + window.location.href);
        });
        return response;
    }
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    throw new Error(response.statusText);
}

export function getCookie(name: string) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        let partsPopped: string | undefined = parts.pop();
        if (partsPopped){
            const partsPoppedSplitAndShift = partsPopped.split(";").shift();
            return  partsPoppedSplitAndShift ? partsPoppedSplitAndShift : "null"
        } else {
            return "null"
        }
    } else {
        return "null";
    }
}

export function fetchToJson(urlPath: string) {
    return serverRequest(RequestMethod.GET, urlPath, null);
}

export function fetchPut(urlPath: string, body: string) {
    return serverRequest(RequestMethod.PUT, urlPath, body);
}

export function fetchPost(urlPath: string, body: string|FormData) {
    return serverRequest(RequestMethod.POST, urlPath, body);
}

export function fetchDelete(urlPath: string) {
    const OPTIONS: RequestInit = {
        headers: getHeaders(),
        method: RequestMethod.DELETE
    };
    return fetch(getApiBaseUrl() + urlPath, OPTIONS).then(sjekkStatuskode);
}

