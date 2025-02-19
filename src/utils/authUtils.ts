import { GetServerSidePropsContext } from "next/dist/types";

export const extractAuthHeader = (req: GetServerSidePropsContext["req"]): string => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error("Missing authorization header");
    }
    return authHeader;
};
