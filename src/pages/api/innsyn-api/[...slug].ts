import type { NextApiRequest, NextApiResponse } from "next";
import { proxyApiRouteRequest } from "@navikt/next-api-proxy";
import { getToken } from "@navikt/oasis";

import { browserEnv, getServerEnv } from "../../../config/env";

const handler = async (req: NextApiRequest, res: NextApiResponse<unknown>) => {
    const { slug, ...params } = req.query;
    const token = getToken(req);

    if (!token) {
        res.status(401);
        return;
    }
    if (!slug) {
        res.status(400).json({ message: "Manglende path" });
        return;
    }
    const queryParams = Object.entries(params);
    const queryString = queryParams
        .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(",") : value}`)
        .join("&");
    const path = Array.isArray(slug) ? slug.join("/") : slug;
    const pathWithoutTrailingSlash = path.endsWith("/") ? path.slice(0, -1) : path;
    const fullPath =
        "/sosialhjelp/innsyn-api/" + pathWithoutTrailingSlash + (queryString !== "" ? `?${queryString}` : "");
    await proxyApiRouteRequest({
        req,
        res,
        bearerToken: token,
        hostname: getServerEnv().NEXT_INNSYN_API_HOSTNAME,
        path: fullPath,
        https: false,
        port: browserEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local" ? 8080 : undefined,
    });
    if (res.statusCode === 401) {
        return res.redirect(`/oauth2/login?redirect=${req.headers.referer}`);
    }
};

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

export default handler;
