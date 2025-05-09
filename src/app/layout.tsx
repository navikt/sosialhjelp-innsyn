import { DecoratorFetchProps, fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import { cookies } from "next/headers";
import Script from "next/script";
import React from "react";

import "../index.css";
import Providers from "./Providers";
import { getFlagsServerSide } from "./featureToggles";

const DECORATOR_LANG_COOKIE = "decorator-language" as const;
const SUPPORTED_LANGUAGES = ["en", "nb", "nn"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
const isSupportedLanguage = (lang: string): lang is SupportedLanguage =>
    SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);

const decoratorParams = (locale: SupportedLanguage): DecoratorFetchProps => ({
    env: createDecoratorEnv(),
    serviceDiscovery: true,
    params: {
        simple: false,
        feedback: false,
        chatbot: false,
        shareScreen: false,
        utilsBackground: "white",
        logoutUrl: process.env.NEXT_PUBLIC_DEKORATOREN_LOGOUT_URL || undefined,
        availableLanguages: [
            {
                locale: "nb",
                handleInApp: true,
            },
            {
                locale: "nn",
                handleInApp: true,
            },
            {
                locale: "en",
                handleInApp: true,
            },
        ],
        language: locale,
        // TODO: Implement breadcrumbs
        // breadcrumbs: getBreadcrumbs(ctx.pathname),
        logoutWarning: false,
    },
});

function createDecoratorEnv(): "dev" | "prod" {
    switch (process.env.NEXT_PUBLIC_DEKORATOR_MILJO ?? "dev") {
        case "local":
        case "test":
        case "dev":
            return "dev";
        case "prod":
            return "prod";
        default:
            throw new Error(`Unknown runtime environment: ${process.env.DEKORATOR_MILJO}`);
    }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const jar = await cookies();
    const cookie = jar.get(DECORATOR_LANG_COOKIE)?.value;
    const locale = cookie && isSupportedLanguage(cookie) ? cookie : "nb";
    const props = decoratorParams(locale);
    const Decorator = await fetchDecoratorReact(props);

    const flags = await getFlagsServerSide();

    // const harTilgangResponse = await harTilgang();
    return (
        <html lang={locale || "no"}>
            <head>
                <Decorator.HeadAssets />
                <link
                    rel="preload"
                    href="https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link rel="icon" href="https://www.nav.no/favicon.ico" type="image/x-icon" />
            </head>
            <body>
                <Decorator.Header />
                <Providers toggles={flags.toggles}>{children}</Providers>
                <Decorator.Footer />
                <Decorator.Scripts loader={Script} />
            </body>
        </html>
    );
}
