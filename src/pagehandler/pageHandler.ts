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
    tilgang?: TilgangResponse;
    toggles: IToggle[];
    dehydratedState?: DehydratedState;
}

function buildUrl() {
    const isLocal = "local" === process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT;
    const portPart = isLocal ? ":8080" : "";
    return `http://${process.env.NEXT_INNSYN_API_HOSTNAME}${portPart}/sosialhjelp/innsyn-api/api/v1/innsyn/tilgang`;
}

const pageHandler = async (
    context: GetServerSidePropsContext,
    translationNamespaces: string[] | string | undefined = ["common"],
    queryClient?: QueryClient
): Promise<GetServerSidePropsResult<PageProps>> => {
    const { translations, flags, tilgang } = await getCommonProps(context, translationNamespaces);

    return {
        props: {
            ...translations,
            ...flags,
            tilgang,
            dehydratedState: queryClient ? dehydrate(queryClient) : undefined,
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
        const tilgangResponse = await fetch(buildUrl(), { headers });
        if (tilgangResponse.ok) {
            const data: { harTilgang: boolean; fornavn: string } = await tilgangResponse.json();
            return { translations, flags, tilgang: data };
        } else {
            logger.error(
                `Fikk feil ved innhenting av tilgangsdata. Status: ${tilgangResponse.status}, data: ${await tilgangResponse.text()}`
            );
        }
    } catch (e: unknown) {
        logger.error(`Something happened during fetch in getServerSideProps for url ${resolvedUrl}. Error: ${e}`);
    }
    return { translations, flags };
};

export default pageHandler;
