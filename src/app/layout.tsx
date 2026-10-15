import "./globals.css";

import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import { logger } from "@navikt/next-logger";
import { headers } from "next/headers";
import React, { PropsWithChildren } from "react";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { TilgangResponse } from "@generated/model";
import { getToggles } from "@featuretoggles/unleash";
import { browserEnv } from "@config/env";
import { Page, PageBlock } from "@navikt/ds-react/Page";
import { Theme } from "@navikt/ds-react";
import Script from "next/script";
import decoratorParams from "@config/decoratorConfig";
import { Driftsmeldinger } from "@components/driftsmelding/Driftsmeldinger";

import Footer from "@components/footer/Footer";
import { DEFAULT_LOCALE, isSupportedLocale } from "@i18n/common";
import Providers from "./[locale]/Providers";
import LocaleProvider from "./LocaleProvider";

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

const buildHeaders = async () => {
    if (process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "e2e") {
        return new Headers();
    }
    const token = await getToken();
    if (!token) {
        throw new Error("Missing auth header");
    }
    const headers: HeadersInit = new Headers();
    headers.append("Authorization", token);
    return headers;
};

const harTilgang = async (): Promise<TilgangResponse | undefined> => {
    const headers = await buildHeaders();

    try {
        const tilgangResponse = await fetch(buildUrl("/tilgang"), { headers });
        if (tilgangResponse.ok) {
            return await tilgangResponse.json();
        }
        logger.error(
            `Fikk feil ved innhenting av tilgangsdata. Status: ${tilgangResponse.status}, data: ${await tilgangResponse.text()}`
        );
    } catch (e: unknown) {
        logger.error(`Something happened during fetch in RootLayout. Error: ${e}`);
    }
};

export default async function RootLayout({ children }: PropsWithChildren) {
    const requestedLocale = await getLocale();
    const locale = isSupportedLocale(requestedLocale) ? requestedLocale : DEFAULT_LOCALE;
    const toggles = getToggles();
    const harTilgangResponse = harTilgang();
    const Decorator = await fetchDecoratorReact(decoratorParams(locale));
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <head>
                <Decorator.HeadAssets />
                <link rel="icon" href="https://www.nav.no/favicon.ico" type="image/x-icon" />
            </head>
            <body>
                <LocaleProvider locale={locale} messages={messages}>
                    <Theme theme="light">
                        <Page
                            footer={
                                <>
                                    <PageBlock width="md" gutters>
                                        <Footer />
                                    </PageBlock>
                                    <Decorator.Footer />
                                </>
                            }
                        >
                            <Decorator.Header />
                            <PageBlock as="main" width="md" gutters id="maincontent" tabIndex={-1}>
                                <Driftsmeldinger />
                                <Providers togglesPromise={toggles} tilgang={harTilgangResponse}>
                                    {children}
                                </Providers>
                            </PageBlock>
                        </Page>
                    </Theme>
                </LocaleProvider>
                <Decorator.Scripts loader={Script} />
            </body>
        </html>
    );
}

export const generateMetadata = async () => {
    const t = await getTranslations("Metadata");
    return {
        title: t("tittel"),
        description: t("beskrivelse"),
    };
};
