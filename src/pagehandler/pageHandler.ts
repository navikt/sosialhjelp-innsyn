import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { IToggle } from "@unleash/nextjs";
import { logger } from "@navikt/next-logger";
import { dehydrate, DehydratedState, QueryClient } from "@tanstack/react-query";
import { Messages } from "next-intl";

import { TilgangResponse } from "../generated/model";
import { getFlagsServerSide } from "../featuretoggles/ssr";
import { extractAuthHeader } from "../utils/authUtils";

export interface PageProps {
    tilgang?: TilgangResponse;
    toggles: IToggle[];
    dehydratedState: DehydratedState | null;
    messages: Messages;
}

export function buildUrl(path: string) {
    const isLocal = "local" === process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT;
    const portPart = isLocal ? ":8080" : "";
    return `http://${process.env.NEXT_INNSYN_API_HOSTNAME}${portPart}/sosialhjelp/innsyn-api/api/v1/innsyn${path}`;
}

const pageHandler = async (
    context: GetServerSidePropsContext<{ locale: "nb" | "nn" | "en" }>,
    queryClient?: QueryClient
): Promise<GetServerSidePropsResult<PageProps>> => {
    const token = extractAuthHeader(context.req);
    if (!token) {
        return {
            redirect: {
                destination: process.env.NEXT_INNSYN_MOCK_LOGIN_URL!,
                permanent: false,
            },
        };
    }
    const { messages, flags, tilgang } = await getCommonProps(context, token);
    return {
        props: {
            messages,
            ...flags,
            tilgang,
            dehydratedState: queryClient ? dehydrate(queryClient) : null,
        },
    };
};

export const getCommonProps = async (
    { req, res, resolvedUrl, params }: GetServerSidePropsContext<{ locale: "nb" | "nn" | "en" }>,
    token: string
) => {
    const locale = params?.locale ?? "nb";
    const messages = (await import(`../../messages/${locale}.json`)).default;
    const flags = await getFlagsServerSide(req, res);
    const headers: HeadersInit = new Headers();
    headers.append("Authorization", token);
    try {
        const tilgangResponse = await fetch(buildUrl("/tilgang"), { headers });
        if (tilgangResponse.ok) {
            const data: { harTilgang: boolean; fornavn: string } = await tilgangResponse.json();
            return { messages, flags, tilgang: data };
        } else {
            logger.error(
                `Fikk feil ved innhenting av tilgangsdata. Status: ${tilgangResponse.status}, data: ${await tilgangResponse.text()}`
            );
        }
    } catch (e: unknown) {
        logger.error(`Something happened during fetch in getServerSideProps for url ${resolvedUrl}. Error: ${e}`);
    }
    return { messages, flags };
};

export default pageHandler;
