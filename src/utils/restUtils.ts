import 'whatwg-fetch'

export function erDev(): boolean {
    const url = window.location.href;
    return (url.indexOf("localhost:3000") > 0);
}

export function getApiBaseUrl(): string {
    if (erDev()) {
        return "http://localhost:8080/soknadsosialhjelp/innsyn-api/api/v1/innsyn"; // /1234/saksStatus
    } else {
        return "/soknadsosialhjelp/innsyn-api/api/v1/innsyn";
    }
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
        "Authorization": "1234", // TODO: Ikke hardkodet Authorization id
        "Accept": "application/json, text/plain, */*"
    });
};

export const serverRequest = (method: string, urlPath: string, body: string|null) => {
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
        return response;
    }
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    throw new Error(response.statusText);
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
        method: RequestMethod.DELETE
    };
    return fetch(getApiBaseUrl() + urlPath, OPTIONS).then(sjekkStatuskode);
}

