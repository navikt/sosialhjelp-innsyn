import { logger } from "@navikt/next-logger";
import { isAbortError } from "next/dist/server/pipe-readable";

const getBody = <T>(c: Response | Request): Promise<T> => {
    const contentType = c.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        return c.json();
    }

    if (contentType && contentType.includes("application/pdf")) {
        return c.blob() as Promise<T>;
    }

    return c.text() as Promise<T>;
};

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
    const response = await fetch(url, {
        credentials: ["mock", "local"].includes(process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT ?? "")
            ? "include"
            : undefined,
        ...options,
    });
    if (response.status === 204) {
        return [] as T;
    }
    if (!response.ok && !response.redirected) {
        try {
            const body = await getBody<string | unknown>(response);
            const message = typeof body === "string" ? body : JSON.stringify(body);
            logger.error(
                `Non-ok response from ${url}: ${response.status} ${response.statusText}. Response: ${message}`
            );
        } catch (e) {
            logger.error(
                `error trying to get body from non-ok response from ${url}: ${response.status} ${response.statusText}. Exception: ${e}`
            );
            throw new Error(`error trying to get body from non-ok response.`);
        }
        throw new Error(`Non-ok response from ${url}: ${response.status} ${response.statusText}`);
    }
    try {
        const data = await getBody<T>(response);
        // Kommer som application/json, og blir derfor parsa til json, aka "false" | "true". Konverterer derfor til boolean her.
        if (data === "true") {
            return true as T;
        } else if (data === "false") {
            return false as T;
        }
        // Trenger å få med statuskode på /tilgang
        if (url.includes("/tilgang")) {
            return { data, status: response.status } as T;
        }
        return data as T;
    } catch (e) {
        if (isAbortError(e)) return {} as T;
        logger.error(
            `error trying to get body from ok response from ${url}: ${response.status} ${response.statusText}. Exception: ${e}`
        );
        throw new Error(`error trying to get body from response.`);
    }
};

export type ErrorType<Error> = Error & {
    message?: string;
    navCallId?: string;
};
