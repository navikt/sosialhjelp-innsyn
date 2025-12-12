import { proxyRouteHandler } from "@navikt/next-api-proxy";

import { getServerEnv } from "@config/env";

export type RouteHandlerProxyTarget = {
    hostname: string;
    path: string;
    https: boolean;
    bearerToken?: string;
    port?: string;
};
type ProxyRequestHandler = (request: Request, context: ProxyRequestContext) => Promise<Response>;
type ProxyRequestContext = { params: Promise<{ slug: string[] }> };

const apiProxy = async (
    func: (params: Promise<{ slug: string[] }>, bearerToken: string | undefined) => Promise<RouteHandlerProxyTarget>
): Promise<ProxyRequestHandler> => {
    return async (request, { params }) => {
        if (getServerEnv().NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "e2e") {
            return proxyRouteHandler(request, await func(params, "token"));
        }
        const headers = request.headers;
        if (!headers.has("Authorization")) {
            return new Response("Missing auth header", { status: 401 });
        }
        const bearerToken = `${headers.get("Authorization")?.split(" ")[1]}`;

        return proxyRouteHandler(request, await func(params, bearerToken));
    };
};

export default apiProxy;
