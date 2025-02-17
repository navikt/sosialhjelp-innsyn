import { GetServerSidePropsContext } from "next/dist/types";

export const extractAuthHeader = (req: GetServerSidePropsContext["req"]): string => {
    let authHeader;
    if (["mock", "local"].includes(process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT!)) {
        if (!req.cookies["localhost-idtoken"]) {
            throw new Error("Missing auth header");
        }
        authHeader = "Bearer " + req.cookies["localhost-idtoken"];
    } else {
        if (!req.headers.authorization) {
            throw new Error("Missing auth header");
        }
        authHeader = req.headers.authorization;
    }
    return authHeader;
};
