import { GetServerSidePropsContext } from "next/dist/types";

export const extractAuthHeader = (req: GetServerSidePropsContext["req"]): string | null => {
    const header = req.headers.authorization;

    if (!header) {
        return null;
    }
    return header;
};
