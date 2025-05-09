import { proxyRouteHandler } from "@navikt/next-api-proxy";

type RouteHandlerProxyTarget = { hostname: string; path: string; https: boolean; bearerToken?: string; port?: string };
type ProxyRequestContext = { params: Promise<{ slug: string[] }> };
type ProxyRequestHandler = (request: Request, context: ProxyRequestContext) => Promise<Response>;

const getRouteHandlerProxyTarget = (headers: Headers, requestPath: string[]): RouteHandlerProxyTarget => {
    const hostname = process.env.NEXT_INNSYN_API_HOSTNAME;
    if (!hostname) {
        throw new Error("Missing innsyn-api hostname config");
    }
    const basePath = "/sosialhjelp/innsyn-api";
    const https = false;

    const path = `${basePath}/${requestPath.join("/")}`;
    const bearerToken = `${headers.get("Authorization")?.split(" ")[1]}`;
    const port = process.env.INNSYN_API_PORT;
    return { hostname, path: encodeURI(path), bearerToken, https, port };
};

const soknadApiProxy: ProxyRequestHandler = async (request, { params }): Promise<Response> => {
    return proxyRouteHandler(request, getRouteHandlerProxyTarget(request.headers, (await params).slug));
};

export const DELETE = soknadApiProxy;
export const GET = soknadApiProxy;
export const OPTIONS = soknadApiProxy;
export const POST = soknadApiProxy;
export const PUT = soknadApiProxy;
