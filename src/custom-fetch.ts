import { logger } from "@navikt/next-logger";
import { browserEnv, getServerEnv } from "@config/env";

/**
 * Custom error class for fetch failures with HTTP context
 */
export class FetchError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly statusText: string,
        public readonly url: string,
        public readonly responseBody?: unknown
    ) {
        super(message);
        this.name = "FetchError";
        // Maintain proper stack trace for where the error was thrown (V8 only)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError);
        }
    }
}

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

/**
 * Server-side fetch for SSR contexts
 * @deprecated Use authenticatedFetch from @api/ssr/authenticatedFetch instead
 */
export const customFetchSSR = async <T>(url: string, options: RequestInit): Promise<T> => {
    const isLocal = getServerEnv().NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local";
    const port = isLocal ? `:${getServerEnv().INNSYN_API_PORT}` : "";
    const origin = `http://${getServerEnv().NEXT_INNSYN_API_HOSTNAME}${port}`;
    return doFetch(`${origin}/sosialhjelp/innsyn-api${url}`, options);
};

/**
 * Client-side fetch for browser contexts
 */
export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
    return doFetch(`${browserEnv.NEXT_PUBLIC_BASE_PATH}/api/innsyn-api${url}`, options);
};

/**
 * Core fetch implementation with proper error handling
 */
const doFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
    const response = await fetch(url, options);

    // Handle 204 No Content
    if (response.status === 204) {
        return [] as T;
    }

    // Handle non-OK responses (4xx, 5xx)
    if (!response.ok && !response.redirected) {
        // Handle 401 Unauthorized - redirect to login (client-side only)
        if (response.status === 401 && typeof window !== "undefined") {
            window.location.replace("/sosialhjelp/innsyn/oauth2/login?redirect=" + window.location.href);
            // Throw error to prevent further execution
            throw new FetchError("Unauthorized - redirecting to login", 401, response.statusText, url);
        }

        let responseBody: unknown;
        try {
            responseBody = await getBody(response);
        } catch {
            // Failed to parse error response body - continue with undefined
        }

        const message = responseBody
            ? typeof responseBody === "string"
                ? responseBody
                : JSON.stringify(responseBody)
            : response.statusText;

        // Log based on severity (client errors vs server errors)
        if (response.status >= 400 && response.status < 500) {
            // Client errors - these are expected (401, 404, etc.)
            logger.info(`Client error from ${url}: ${response.status} ${response.statusText} - ${message}`);
        } else {
            // Server errors - these need attention
            logger.error(`Server error from ${url}: ${response.status} ${response.statusText} - ${message}`);
        }

        // Throw structured error that preserves all context
        throw new FetchError(
            `HTTP ${response.status}: ${message}`,
            response.status,
            response.statusText,
            url,
            responseBody
        );
    }

    const data = await getBody<T>(response);

    // Handle boolean strings - some API endpoints return "true"/"false" as JSON strings
    if (data === "true") {
        return true as T;
    } else if (data === "false") {
        return false as T;
    }

    return data;
};

export type ErrorType<T> = T;
