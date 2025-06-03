import { proxyRouteHandler } from "@navikt/next-api-proxy";
import { cookies } from "next/headers";

import { isLocalhost, isMock } from "../../../../utils/restUtils";
import { getServerEnv } from "../../../../config/env";

type RouteHandlerProxyTarget = { hostname: string; path: string; https: boolean; bearerToken?: string; port?: string };
type ProxyRequestContext = { params: Promise<{ slug: string[] }> };
type ProxyRequestHandler = (request: Request, context: ProxyRequestContext) => Promise<Response>;

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

const soknadApiProxy: ProxyRequestHandler = async (request, { params }): Promise<Response> => {
    let bearerToken;
    if (isLocalhost() || isMock()) {
        const cookieStore = await cookies();
        if (!cookieStore.has("localhost-idtoken")) {
            return new Response("Missing auth header", { status: 401 });
        }
        bearerToken = cookieStore.get("localhost-idtoken")?.value;
    } else {
        const headers = request.headers;
        if (!headers.has("Authorization")) {
            return new Response("Missing auth header", { status: 401 });
        }
        bearerToken = `${headers.get("Authorization")?.split(" ")[1]}`;
    }
    return proxyRouteHandler(request, await getRouteHandlerProxyTarget(bearerToken, (await params).slug));
};

export const DELETE = soknadApiProxy;
export const GET = soknadApiProxy;
export const OPTIONS = soknadApiProxy;
export const POST = soknadApiProxy;
export const PUT = soknadApiProxy;
