import { getServerEnv } from "@config/env";
import apiProxy, { RouteHandlerProxyTarget } from "@api/proxy/apiProxy";

const getRouteHandlerProxyTarget = async (
    bearerToken: string | undefined,
    requestPath: string[]
): Promise<RouteHandlerProxyTarget> => {
    const hostname = process.env.NEXT_INNSYN_API_HOSTNAME;
    if (!hostname) {
        throw new Error("Missing innsyn-api hostname config");
    }
    const basePath = "/sosialhjelp/innsyn-api";
    const https = false;

    const path = `${basePath}/${requestPath.join("/")}`;
    const port = getServerEnv().INNSYN_API_PORT;
    return { hostname, path: encodeURI(path), bearerToken, https, port };
};

const innsynApiProxy = await apiProxy(async (params, bearerToken) =>
    getRouteHandlerProxyTarget(bearerToken, (await params).slug)
);

export const DELETE = innsynApiProxy;
export const GET = innsynApiProxy;
export const OPTIONS = innsynApiProxy;
export const POST = innsynApiProxy;
export const PUT = innsynApiProxy;
