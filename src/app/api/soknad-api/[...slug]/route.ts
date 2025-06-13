import { getServerEnv } from "../../../../config/env";
import apiProxy, { RouteHandlerProxyTarget } from "../../../../api/proxy/apiProxy";

const getRouteHandlerProxyTarget = async (
    bearerToken: string | undefined,
    requestPath: string[]
): Promise<RouteHandlerProxyTarget> => {
    const hostname = getServerEnv().SOKNAD_API_HOSTNAME;
    if (!hostname) {
        throw new Error("Missing innsyn-api hostname config");
    }
    const basePath = "/sosialhjelp/soknad-api";
    const https = false;

    const path = `${basePath}/${requestPath.join("/")}`;
    const port = getServerEnv().SOKNAD_API_PORT;
    return { hostname, path: encodeURI(path), bearerToken, https, port };
};

const soknadApiProxy = await apiProxy(async (params, bearerToken) =>
    getRouteHandlerProxyTarget(bearerToken, (await params).slug)
);

export const DELETE = soknadApiProxy;
export const GET = soknadApiProxy;
export const OPTIONS = soknadApiProxy;
export const POST = soknadApiProxy;
export const PUT = soknadApiProxy;
