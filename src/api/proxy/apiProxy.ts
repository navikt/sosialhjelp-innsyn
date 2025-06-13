import { cookies } from "next/headers";
import { proxyRouteHandler } from "@navikt/next-api-proxy";

import { isLocalhost, isMock } from "../../utils/restUtils";
import { getServerEnv } from "../../config/env";

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
        let bearerToken;
        if (isLocalhost() || isMock() || getServerEnv().NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "e2e") {
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
        return proxyRouteHandler(request, await func(params, bearerToken));
    };
};

export default apiProxy;
