import { proxyRouteHandler } from "@navikt/next-api-proxy";
import { cookies } from "next/headers";

type RouteHandlerProxyTarget = { hostname: string; path: string; https: boolean; bearerToken?: string; port?: string };
type ProxyRequestContext = { params: Promise<{ slug: string[] }> };
type ProxyRequestHandler = (request: Request, context: ProxyRequestContext) => Promise<Response>;

const getRouteHandlerProxyTarget = async (
    headers: Headers,
    requestPath: string[]
): Promise<RouteHandlerProxyTarget> => {
    const hostname = process.env.NEXT_INNSYN_API_HOSTNAME;
    if (!hostname) {
        throw new Error("Missing innsyn-api hostname config");
    }
    const basePath = "/sosialhjelp/innsyn-api";
    const https = false;

    const path = `${basePath}/${requestPath.join("/")}`;
    const port = process.env.INNSYN_API_PORT;
    let bearerToken;
    if (process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local") {
        const cookieStore = await cookies();
        if (!cookieStore.has("localhost-idtoken")) {
            throw new Error("Missing localhost-idtoken cookie");
        }
        bearerToken = cookieStore.get("localhost-idtoken")?.value;
    } else {
        if (headers.has("Authorization")) {
            throw new Error("Missing auth header");
        }
        bearerToken = `${headers.get("Authorization")?.split(" ")[1]}`;
    }
    return { hostname, path: encodeURI(path), bearerToken, https, port };
};

const soknadApiProxy: ProxyRequestHandler = async (request, { params }): Promise<Response> => {
    return proxyRouteHandler(request, await getRouteHandlerProxyTarget(request.headers, (await params).slug));
};

export const DELETE = soknadApiProxy;
export const GET = soknadApiProxy;
export const OPTIONS = soknadApiProxy;
export const POST = soknadApiProxy;
export const PUT = soknadApiProxy;
