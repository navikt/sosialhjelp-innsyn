import { GetServerSidePropsContext } from "next/dist/types";

export const extractAuthHeader = (req: GetServerSidePropsContext["req"]): string | null => {
    let authHeader;
    if (["mock", "local"].includes(process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT!)) {
        const cookie = req.cookies["localhost-idtoken"];
        if (!cookie) {
            return null;
        }
        authHeader = "Bearer " + cookie;
    } else {
        const header = req.headers.authorization;
        if (!header) {
            return null;
        }
        authHeader = header;
    }
    return authHeader;
};
