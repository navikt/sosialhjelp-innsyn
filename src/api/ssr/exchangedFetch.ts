import { headers } from "next/headers";
import { requestOboToken } from "@navikt/oasis";
import { logger } from "@navikt/next-logger";

import { getServerEnv } from "../../config/env";

const getAuthorizationHeader = async (): Promise<string | null> => (await headers()).get("authorization");

const exchangedFetch = async <T>(url: string, host?: string, basePath?: string, port?: string): Promise<T> => {
    const token = await getAuthorizationHeader();
    if (!token) {
        throw new Error("Missing Authorization header/cookie");
    }
    try {
        const result = await requestOboToken(token, getServerEnv().SOKNAD_API_AUDIENCE);
        if (!result.ok) {
            return Promise.reject(`Failed to exchange token. Status: ${result.error}`);
        }
        const _port = port ?? getServerEnv().INNSYN_API_PORT;
        const portPart = _port ? `:${_port}` : "";
        const hostnamePart = host ?? getServerEnv().NEXT_INNSYN_API_HOSTNAME;
        const basePathPart = basePath ?? "/sosialhjelp/innsyn-api";
        const absoluteUrl = new URL(`http://${hostnamePart}${portPart}${basePathPart}` + url);

        const response = await fetch(absoluteUrl, {
            headers: {
                Authorization: `Bearer ${result.token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Fikk non-ok response fra ${absoluteUrl}: ${response.status} ${response.statusText}`);
        }
        return (await response.json()) as T;
    } catch (e: unknown) {
        logger.error(`Failed to exchange token: ${e}`);
        throw e;
    }
};

export default exchangedFetch;
