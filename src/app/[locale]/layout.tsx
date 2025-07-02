import { headers } from "next/headers";
import { logger } from "@navikt/next-logger";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import React, { PropsWithChildren } from "react";
import { getTranslations } from "next-intl/server";

import { routing } from "../../i18n/routing";
import { TilgangResponse } from "../../generated/model";
import { SupportedLocale } from "../../i18n/common";
import { getToggles } from "../../featuretoggles/unleash";
import { browserEnv } from "../../config/env";

import Providers from "./Providers";

function buildUrl(path: string) {
    const isLocal = ["local", "e2e"].includes(browserEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT);
    const portPart = isLocal ? ":8080" : "";
    return `http://${process.env.NEXT_INNSYN_API_HOSTNAME}${portPart}/sosialhjelp/innsyn-api/api/v1/innsyn${path}`;
}

const getToken = async (): Promise<string | null> => {
    const readOnlyHeaders = await headers();
    if (!readOnlyHeaders.has("Authorization")) {
        throw new Error("Missing auth header");
    }

    return readOnlyHeaders.get("Authorization");
};

const harTilgang = async (): Promise<TilgangResponse | undefined> => {
    const token = await getToken();
    if (!token) {
        throw new Error("Missing auth header");
    }
    const headers: HeadersInit = new Headers();
    headers.append("Authorization", token);
    try {
        const tilgangResponse = await fetch(buildUrl("/tilgang"), { headers });
        if (tilgangResponse.ok) {
            return await tilgangResponse.json();
        } else {
            logger.error(
                `Fikk feil ved innhenting av tilgangsdata. Status: ${tilgangResponse.status}, data: ${await tilgangResponse.text()}`
            );
        }
    } catch (e: unknown) {
        logger.error(`Something happened during fetch in LocaleLayout. Error: ${e}`);
    }
};

export default async function LocaleLayout({ children, params }: PropsWithChildren<Props>) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const toggles = await getToggles();

    const harTilgangResponse = await harTilgang();
    return (
        <NextIntlClientProvider>
            <Providers toggles={toggles} tilgang={harTilgangResponse}>
                {children}
            </Providers>
        </NextIntlClientProvider>
    );
}

interface Props {
    params: Promise<{ locale: SupportedLocale }>;
}

export const generateMetadata = async () => {
    const t = await getTranslations("Metadata");
    return {
        title: t("tittel"),
        description: t("beskrivelse"),
    };
};
