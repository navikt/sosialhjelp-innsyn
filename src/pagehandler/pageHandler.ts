import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { SSRConfig } from "next-i18next";
import { IToggle } from "@unleash/nextjs";
import { logger } from "@navikt/next-logger";

import { TilgangResponse } from "../generated/model";
import { getFlagsServerSide } from "../featuretoggles/ssr";

export interface PageProps extends SSRConfig {
    tilgang?: TilgangResponse;
    toggles: IToggle[];
}

function buildUrl() {
    const isLocal = "local" === process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT;
    const portPart = isLocal ? ":8080" : "";
    return `http://${process.env.NEXT_INNSYN_API_HOSTNAME}${portPart}/sosialhjelp/innsyn-api/api/v1/innsyn/tilgang`;
}

const pageHandler = async (
    { locale, req, res, resolvedUrl }: GetServerSidePropsContext,
    translationNamespaces: string[] | string | undefined = ["common"]
): Promise<GetServerSidePropsResult<PageProps>> => {
    const translations = await serverSideTranslations(locale ?? "nb", translationNamespaces);
    const flags = await getFlagsServerSide(req, res);
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
    const headers: HeadersInit = new Headers();
    headers.append("Authorization", authHeader);
    try {
        const tilgangResponse = await fetch(buildUrl(), { headers });
        if (tilgangResponse.ok) {
            const data: { harTilgang: boolean; fornavn: string } = await tilgangResponse.json();
            return { props: { ...translations, ...flags, tilgang: data } };
        } else {
            logger.error(
                `Fikk feil ved innhenting av tilgangsdata. Status: ${tilgangResponse.status}, data: ${await tilgangResponse.text()}`
            );
        }
    } catch (e: unknown) {
        logger.error(`Something happened during fetch in getServerSideProps for url ${resolvedUrl}. Error: ${e}`);
    }
    return { props: { ...translations, ...flags } };
};

export default pageHandler;
