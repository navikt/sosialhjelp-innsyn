import {IdportenValidationResult, validateIdportenToken} from "@navikt/next-auth-wonderwall";
import {GetServerSidePropsContext, GetServerSidePropsResult, NextApiRequest, NextApiResponse} from "next";
import {logger} from "@navikt/next-logger";

type PageHandler<P> = (context: GetServerSidePropsContext, accessToken: string) => Promise<GetServerSidePropsResult<P>>;

type ApiHandler = (req: NextApiRequest, res: NextApiResponse, accsessToken: string) => Promise<void>;

export function withAuthenticatedPage<P>(handler: PageHandler<P>) {
    return async function withBearerTokenHandler(
        context: GetServerSidePropsContext
    ): Promise<ReturnType<NonNullable<typeof handler>>> {
        if (process.env.NEXT_USE_WONDERWALL === "false" || process.env.NODE_ENV === "development") {
            return handler(context, "token");
        }
        const request = context.req;
        const bearerToken: string | null | undefined = request.headers["authorization"];

        if (!bearerToken) {
            throw new Error("Could not find any bearer token on the request.");
        }

        const tokenValidationResult = await validateIdportenToken(bearerToken);
        if (tokenValidationResult !== "valid") {
            logger.error(
                `Invalid JWT token found (${tokenValidationResult.errorType} ${tokenValidationResult.message}), redirecting to login.`
            );

            return {
                redirect: {
                    destination: `/oauth2/login?redirect=${context.resolvedUrl}`,
                    permanent: false,
                },
            };
        }

        return handler(context, bearerToken.replace("Bearer ", ""));
    };
}

export function withAuthenticatedApiRoute(handler: ApiHandler) {
    return async function withBearerToken(req: NextApiRequest, res: NextApiResponse) {
        if (process.env.NODE_ENV !== "production" || process.env.NEXT_USE_WONDERWALL === "false") {
            return await handler(req, res, "fakeAccessToken");
        }
        const authorizationHeader: string | undefined = req.headers["authorization"];
        if (authorizationHeader == null) {
            return res.status(401).json({message: "not authorization"});
        }

        const validate: IdportenValidationResult = await validateIdportenToken(authorizationHeader);
        if (validate === "valid") {
            return handler(req, res, authorizationHeader.replace("Bearer ", ""));
        } else {
            logger.info(`Failed to validate due to: ${validate.errorType} ${validate.message}`);
            return res.status(401).json({message: "not authorization"});
        }
    };
}
