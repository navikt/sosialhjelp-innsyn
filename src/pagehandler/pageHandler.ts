import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { SSRConfig } from "next-i18next";
import { IToggle } from "@unleash/nextjs";
import { logger } from "@navikt/next-logger";
import { dehydrate, DehydratedState, QueryClient } from "@tanstack/react-query";

import { TilgangResponse } from "../generated/model";
import { getFlagsServerSide } from "../featuretoggles/ssr";
import { extractAuthHeader } from "../utils/authUtils";

export interface PageProps extends SSRConfig {
    tilgang: TilgangResponse | null;
    toggles: IToggle[];
    dehydratedState: DehydratedState | null;
}

export function buildUrl(path: string) {
    const isLocal = "local" === process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT;
    const portPart = isLocal ? ":8080" : "";
    return `http://${process.env.NEXT_INNSYN_API_HOSTNAME}${portPart}/sosialhjelp/innsyn-api/api/v1/innsyn${path}`;
}

const pageHandler = async (
    context: GetServerSidePropsContext,
    translationNamespaces: string[] | string | undefined = ["common"],
    queryClient?: QueryClient
): Promise<GetServerSidePropsResult<PageProps>> => {
    const { translations, flags, tilgang, tilgangStatus } = await getCommonProps(context, translationNamespaces);
    if (tilgangStatus === 401) {
        return {
            redirect: {
                destination: `${process.env.NEXT_PUBLIC_LOGIN_URL}?redirect=/sosialhjelp/innsyn${context.resolvedUrl}`,
                permanent: false,
            },
        };
    }

    return {
        props: {
            ...translations,
            ...flags,
            tilgang: tilgang ?? null,
            dehydratedState: queryClient ? dehydrate(queryClient) : null,
        },
    };
};

export const getCommonProps = async (
    { locale, req, res, resolvedUrl }: GetServerSidePropsContext,
    translationNamespaces: string[] | string | undefined = ["common"]
) => {
    const translations = await serverSideTranslations(locale ?? "nb", translationNamespaces);
    const flags = await getFlagsServerSide(req, res);
    const token = extractAuthHeader(req);
    const headers: HeadersInit = new Headers();
    headers.append("Authorization", token);
    try {
        const tilgangResponse = await fetch(buildUrl("/tilgang"), { headers });
        if (tilgangResponse.ok) {
            const data: { harTilgang: boolean; fornavn: string } = await tilgangResponse.json();
            return { translations, flags, tilgang: data };
        } else {
            logger.error(
                `Fikk feil ved innhenting av tilgangsdata. Status: ${tilgangResponse.status}, data: ${await tilgangResponse.text()}`
            );
            return { translations, flags, tilgangStatus: tilgangResponse.status };
        }
    } catch (e: unknown) {
        logger.error(`Something happened during fetch in getServerSideProps for url ${resolvedUrl}. Error: ${e}`);
    }
    return { translations, flags };
};

export default pageHandler;
