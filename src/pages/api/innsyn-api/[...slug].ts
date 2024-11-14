import type {NextApiRequest, NextApiResponse} from "next";
import {proxyApiRouteRequest} from "@navikt/next-api-proxy";
import {getToken} from "@navikt/oasis";

const handler = async (req: NextApiRequest, res: NextApiResponse<unknown>) => {
    const {slug, ...params} = req.query;
    let token = getToken(req);

    if (process.env.NODE_ENV === "development") {
        // Kommer herifra lokalt/i mock-miljø
        const tokenCookie = req.cookies["localhost-idtoken"];
        if (tokenCookie) {
            token = tokenCookie;
        }
    }

    if (!token) {
        return res.redirect("/oauth2/login");
    }
    if (!slug) {
        res.status(400).json({message: "Manglende path"});
        return;
    }
    const queryParams = Object.entries(params);
    const queryString = queryParams
        .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(",") : value}`)
        .join("&");
    const path =
        "/sosialhjelp/innsyn-api/" +
        (Array.isArray(slug) ? slug.join("/") : slug) +
        (queryString !== "" ? `?${queryString}` : "");

    await proxyApiRouteRequest({
        req,
        res,
        bearerToken: token,
        hostname: "localhost" ?? "",
        path,
        https: false,
        port: 8080,
    });
};

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

export default handler;
