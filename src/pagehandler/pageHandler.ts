import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { IToggle } from "@unleash/nextjs";
import { logger } from "@navikt/next-logger";
import { dehydrate, DehydratedState, QueryClient } from "@tanstack/react-query";
import { Messages } from "next-intl";
import { Driftsmelding, getDriftsmeldinger } from "@components/driftsmelding/getDriftsmeldinger";

import { TilgangResponse } from "../generated/model";
import { extractAuthHeader } from "../utils/authUtils";
import { getToggles } from "../featuretoggles/deprecated_pages/unleash";
import { browserEnv, getServerEnv } from "../config/env";

export interface PageProps {
    tilgang: TilgangResponse | null;
    toggles: IToggle[];
    dehydratedState: DehydratedState | null;
    messages: Messages;
    driftsmeldinger: Driftsmelding[];
}

export function buildUrl(path: string) {
    const isLocal = ["local", "e2e"].includes(browserEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT);
    const portPart = isLocal ? ":8080" : "";
    return `http://${process.env.NEXT_INNSYN_API_HOSTNAME}${portPart}/sosialhjelp/innsyn-api${path}`;
}

const pageHandler = async (
    context: GetServerSidePropsContext<{ locale: "nb" | "nn" | "en" }>,
    getPrefetchPromises: (queryClient: QueryClient) => Promise<void>[]
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
    const { messages, toggles, tilgang, driftsmeldinger } = await getCommonProps(context, token);
    if (!tilgang && getServerEnv().NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local") {
        logger.warn("Fikk ikke henta tilgangsdata fra innsyn-api, har du huska å skru på backends?");
    }
    const queryClient = new QueryClient();
    if (tilgang?.harTilgang) {
        await Promise.all(getPrefetchPromises(queryClient));
    }
    return {
        props: {
            messages,
            toggles,
            driftsmeldinger,
            tilgang: tilgang ?? null,
            dehydratedState: dehydrate(queryClient),
        },
    };
};

const getTilgang = async (
    token: string,
    resolvedUrl: string
): Promise<{ harTilgang: boolean; fornavn: string } | undefined> => {
    const headers: HeadersInit = new Headers();
    headers.append("Authorization", token);
    try {
        const tilgangResponse = await fetch(buildUrl("/api/v1/innsyn/tilgang"), { headers });
        if (tilgangResponse.ok) {
            return await tilgangResponse.json();
        } else {
            logger.error(
                `Fikk feil ved innhenting av tilgangsdata. Status: ${tilgangResponse.status}, data: ${await tilgangResponse.text()}`
            );
        }
    } catch (e: unknown) {
        logger.error(`Something happened during fetch in getServerSideProps for url ${resolvedUrl}. Error: ${e}`);
    }
};

export const getCommonProps = async (
    { req, resolvedUrl, params }: GetServerSidePropsContext<{ locale: "nb" | "nn" | "en" }>,
    token: string
) => {
    const locale = params?.locale ?? "nb";
    const messages = (await import(`../../messages/${locale}.json`)).default;
    const toggles = await getToggles(req.cookies);
    const [driftsmeldinger, tilgang] = await Promise.all([getDriftsmeldinger(), getTilgang(token, resolvedUrl)]);
    return { messages, toggles, driftsmeldinger, tilgang };
};

export default pageHandler;
