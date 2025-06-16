import { cookies, headers } from "next/headers";
import { requestOboToken } from "@navikt/oasis";
import { logger } from "@navikt/next-logger";

import { getServerEnv } from "../../config/env";

const getAuthorizationHeader = async (): Promise<string | null> => (await headers()).get("authorization");

const getToken = async (): Promise<string | undefined | null> => {
    if (["mock", "local", "e2e"].includes(getServerEnv().NEXT_PUBLIC_RUNTIME_ENVIRONMENT ?? "")) {
        const cookieJar = await cookies();
        return cookieJar.get("localhost-idtoken")?.value;
    } else {
        return getAuthorizationHeader();
    }
};

const exchangedFetch = async <T>(url: string, host?: string, basePath?: string, port?: string): Promise<T> => {
    const token = await getToken();
    if (!token) {
        throw new Error("Missing Authorization header/cookie");
    }
    try {
        const result = await requestOboToken(token, getServerEnv().SOKNAD_API_AUDIENCE);
        if (!result.ok) {
            logger.error(`Failed to exchange token. Status: ${result.error}`);
            return Promise.reject("Failed to exchange token. Status: ${result.error}");
        }
        const _port = port ?? process.env.INNSYN_API_PORT;
        const portPart = _port ? `:${_port}` : "";
        const hostnamePart = host ?? process.env.NEXT_INNSYN_API_HOSTNAME;
        const basePathPart = basePath ?? "/sosialhjelp/innsyn-api";
        const absoluteUrl = new URL(`http://${hostnamePart}${portPart}${basePathPart}` + url);

        logger.info(`CallingabsoluteUrl: ${absoluteUrl}`);
        const response = await fetch(absoluteUrl, {
            headers: {
                Authorization: `Bearer ${result.token}`,
            },
        });
        if (!response.ok) {
            return Promise.reject(
                new Error(`Failed to fetch ${absoluteUrl}: ${response.status} ${response.statusText}`)
            );
        }
        return (await response.json()) as T;
    } catch (e: unknown) {
        logger.error(`Failed to exchange token: ${e}`);
        throw e;
    }
};

export default exchangedFetch;
