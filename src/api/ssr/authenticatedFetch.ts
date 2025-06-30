import { cookies, headers } from "next/headers";

import { getServerEnv } from "../../config/env";

const getAuthorizationHeader = async (): Promise<string | null> => (await headers()).get("authorization");

const getRequestCookies = async (): Promise<string> => {
    const requestCookies = await cookies();
    return requestCookies
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");
};

const getBody = <T>(c: Response | Request): Promise<T> => {
    const contentType = c.headers.get("content-type");
    if (contentType?.includes("application/json")) return c.json();
    return c.text() as Promise<T>;
};

const getHeaders = async (initHeaders?: HeadersInit): Promise<HeadersInit> => {
    const headers = new Headers(initHeaders);
    const authHeader = await getAuthorizationHeader();
    if (!authHeader) {
        throw new Error("Missing Authorization header");
    }
    headers.set("Authorization", authHeader);

    const requestCookies = await getRequestCookies();
    if (requestCookies) headers.set("Cookie", requestCookies);

    return headers;
};

export const authenticatedFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const port = getServerEnv().INNSYN_API_PORT;
    const portPart = port ? `:${port}` : "";
    const hostname = getServerEnv().NEXT_INNSYN_API_HOSTNAME;
    const absoluteUrl = new URL(`http://${hostname}${portPart}/sosialhjelp/innsyn-api${url}`);

    const response = await fetch(absoluteUrl, { ...options, headers: await getHeaders(options.headers) });
    if (!response.ok) throw new Error(`Failed to fetch ${absoluteUrl}: ${response.status} ${response.statusText}`);

    const data = await getBody(response);
    return data as T;
};

export default authenticatedFetch;
