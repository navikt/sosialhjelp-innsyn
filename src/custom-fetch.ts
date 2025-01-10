import {logger} from "@navikt/next-logger";

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
    if (response.status >= 400) {
        logger.error(`Error fetching ${url}: ${response.status} ${response.statusText}`);
    }
    const data: T = await response.json();

    // Trenger å få med statuskode på /tilgang
    if (url.includes("/tilgang")) {
        return {data, status: response.status} as T;
    }

    return data as T;
};
