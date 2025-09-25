import apiProxy, { RouteHandlerProxyTarget } from "@api/proxy/apiProxy";

import { getServerEnv } from "../../../../config/env";

const getRouteHandlerProxyTarget = async (
    bearerToken: string | undefined,
    requestPath: string[]
): Promise<RouteHandlerProxyTarget> => {
    const hostname = getServerEnv().UPLOAD_API_HOSTNAME;
    if (!hostname) {
        throw new Error("Missing innsyn-api hostname config");
    }
    const basePath = "/sosialhjelp/upload";
    const https = false;

    const path = `${basePath}/${requestPath.join("/")}`;
    const port = getServerEnv().UPLOAD_API_PORT;
    return { hostname, path: encodeURI(path), bearerToken, https, port };
};

const uploadApiProxy = await apiProxy(async (params, bearerToken) =>
    getRouteHandlerProxyTarget(bearerToken, (await params).slug)
);

export const DELETE = uploadApiProxy;
export const GET = uploadApiProxy;
export const OPTIONS = uploadApiProxy;
export const POST = uploadApiProxy;
export const PUT = uploadApiProxy;
