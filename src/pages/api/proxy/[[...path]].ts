import {NextApiRequest, NextApiResponse} from "next";
import {logger} from "@navikt/next-logger";
import {grantTokenXOboToken, isInvalidTokenSet} from "@navikt/next-auth-wonderwall";

import {withAuthenticatedApiRoute} from "../../../auth/withAuth";
import {proxyApiRouteRequest} from "@navikt/next-api-proxy";

const handler = async (req: NextApiRequest, res: NextApiResponse, accessToken: string): Promise<void> => {
    const tokenXToken = await grantTokenXOboToken(accessToken, process.env.INNSYN_API_SCOPE ?? "scope not set");
    if (isInvalidTokenSet(tokenXToken)) {
        logger.error(tokenXToken.message);
        res.status(400).json({message: "Not valid"});
        return;
    }
    const rewrittenPath = req.url!.replace(`/api/proxy`, "");

    await proxyApiRouteRequest({
        path: rewrittenPath,
        req,
        res,
        bearerToken: tokenXToken,
        hostname: "sosialhjelp-innsyn-api-dev",
        https: false,
    });
};

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

export default withAuthenticatedApiRoute(handler);
