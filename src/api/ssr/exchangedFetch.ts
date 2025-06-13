import { cookies, headers } from "next/headers";
import { requestOboToken } from "@navikt/oasis";

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

const exchangedFetch = async (url: string, host?: string, basePath?: string, port?: string) => {
    const token = await getToken();
    if (!token) {
        throw new Error("Missing Authorization header/cookie");
    }
    const result = await requestOboToken(token, getServerEnv().SOKNAD_API_AUDIENCE);
    if (!result.ok) {
        throw new Error(`Failed to exchange token: ${result.error}`);
    }
    const _port = port ?? process.env.INNSYN_API_PORT;
    const portPart = _port ? `:${_port}` : "";
    const hostnamePart = host ?? process.env.NEXT_INNSYN_API_HOSTNAME;
    const basePathPart = basePath ?? "/sosialhjelp/innsyn-api";
    const absoluteUrl = new URL(`http://${hostnamePart}${portPart}${basePathPart}` + url);

    return fetch(absoluteUrl, {
        headers: {
            Authorization: `Bearer ${result.token}`,
        },
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to fetch ${absoluteUrl}: ${response.status} ${response.statusText}`);
        }
        return response.json();
    });
};

export default exchangedFetch;
