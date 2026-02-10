import { cookies, headers } from "next/headers";
import { logger } from "@navikt/next-logger";
import { getServerEnv } from "@config/env";

/**
 * Custom error class for authenticated fetch failures with HTTP context
 */
export class AuthenticatedFetchError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly statusText: string,
        public readonly url: string,
        public readonly responseBody?: unknown
    ) {
        super(message);
        this.name = "AuthenticatedFetchError";
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthenticatedFetchError);
        }
    }
}

const getAuthorizationHeader = async (): Promise<string | null> => (await headers()).get("authorization");

const getRequestCookies = async (): Promise<string> => {
    const requestCookies = await cookies();
    return requestCookies
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");
};

/**
 * Parse response body based on content-type
 */
const getBody = async <T>(response: Response): Promise<T> => {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
        return response.json();
    }

    if (contentType?.includes("application/pdf")) {
        return response.blob() as Promise<T>;
    }

    return response.text() as Promise<T>;
};

const getHeaders = async (initHeaders?: HeadersInit): Promise<HeadersInit> => {
    const headers = new Headers(initHeaders);
    if (process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT !== "e2e") {
        const authHeader = await getAuthorizationHeader();
        if (!authHeader) {
            throw new Error("Missing Authorization header");
        }
        headers.set("Authorization", authHeader);
    }

    const requestCookies = await getRequestCookies();
    if (requestCookies) headers.set("Cookie", requestCookies);

    return headers;
};

/**
 * Server-side authenticated fetch for SSR contexts
 * Automatically includes authorization header and cookies from the request
 */
export const authenticatedFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const port = getServerEnv().INNSYN_API_PORT;
    const portPart = port ? `:${port}` : "";
    const hostname = getServerEnv().NEXT_INNSYN_API_HOSTNAME;
    const absoluteUrl = new URL(`http://${hostname}${portPart}/sosialhjelp/innsyn-api${url}`);

    const response = await fetch(absoluteUrl, { ...options, headers: await getHeaders(options.headers) });
    // Handle 204 No Content
    if (response.status === 204) {
        return [] as T;
    }

    // Handle non-OK responses
    if (!response.ok) {
        let responseBody: unknown;
        try {
            responseBody = await getBody(response);
        } catch {
            // Failed to parse error response body
        }

        const message = responseBody
            ? typeof responseBody === "string"
                ? responseBody
                : JSON.stringify(responseBody)
            : response.statusText;

        // Log based on severity
        if (response.status >= 400 && response.status < 500) {
            logger.info(
                `SSR client error from ${absoluteUrl.pathname}: ${response.status} ${response.statusText} - ${message}`
            );
        } else {
            logger.error(
                `SSR server error from ${absoluteUrl.pathname}: ${response.status} ${response.statusText} - ${message}`
            );
        }

        throw new AuthenticatedFetchError(
            `HTTP ${response.status}: ${message}`,
            response.status,
            response.statusText,
            absoluteUrl.toString(),
            responseBody
        );
    }

    return await getBody<T>(response);
};
