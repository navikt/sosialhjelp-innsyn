import { cookies, headers } from "next/headers";

import { getServerEnv } from "../../config/env";

const getAuthorizationHeader = async (): Promise<string> => (await headers()).get("authorization") ?? "";

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

    if (["mock", "local"].includes(getServerEnv().NEXT_PUBLIC_RUNTIME_ENVIRONMENT ?? "")) {
        if (!headers.has("Authorization")) {
            const cookieJar = await cookies();
            headers.set("Authorization", "Bearer " + cookieJar.get("localhost-idtoken")?.value);
        } else {
            throw new Error("Missing localhost-idtoken cookie in local or mock environment");
        }
    } else {
        headers.set("Authorization", await getAuthorizationHeader());
    }

    if (!headers.has("Authorization")) {
        throw new Error("Missing Authorization header");
    }

    const requestCookies = await getRequestCookies();
    if (requestCookies) headers.set("Cookie", requestCookies);

    return headers;
};

export const authenticatedFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const port = getServerEnv().INNSYN_API_PORT;
    const portPart = port ? `:${port}` : "";
    const hostname = getServerEnv().NEXT_INNSYN_API_HOSTNAME;
    const absoluteUrl = new URL(`http://${hostname}${portPart}/sosialhjelp/innsyn-api` + url);

    const response = await fetch(absoluteUrl, { ...options, headers: await getHeaders(options.headers) });
    if (!response.ok) throw new Error(`Failed to fetch ${absoluteUrl}: ${response.status} ${response.statusText}`);

    const data = await getBody<T>(response);
    return { status: response.status, data, headers: response.headers } as T;
};

export default authenticatedFetch;
