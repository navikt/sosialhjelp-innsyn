import Script from "next/script";
import { DecoratorFetchProps, fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import { cookies, headers } from "next/headers";
import { logger } from "@navikt/next-logger";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import { routing } from "../../i18n/routing";
import { TilgangResponse } from "../../generated/model";
import { getBaseCrumbs } from "../../utils/breadcrumbs";
import Preload from "../preload";

import Providers from "./Providers";
import { getFlagsServerSide } from "./featureTogglesServerSide";

type SupportedLocale = (typeof routing.locales)[number];

const decoratorParams = (locale: SupportedLocale): DecoratorFetchProps => ({
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
        // TODO: Implement breadcrumbs.
        //  Må rendere en slags minimal versjon av breadcrumbs på server, og så sette den fulle versjonen client side, siden vi ikke har tilgang på pathname i rootlayout
        breadcrumbs: getBaseCrumbs(),
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

function buildUrl(path: string) {
    const isLocal = "local" === process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT;
    const portPart = isLocal ? ":8080" : "";
    return `http://${process.env.NEXT_INNSYN_API_HOSTNAME}${portPart}/sosialhjelp/innsyn-api/api/v1/innsyn${path}`;
}

const getToken = async (): Promise<string | null> => {
    let authHeader;
    if (["mock", "local"].includes(process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT!)) {
        const cookieStore = await cookies();
        if (!cookieStore.has("localhost-idtoken")) {
            throw new Error("Missing auth header");
        }
        authHeader = "Bearer " + cookieStore.get("localhost-idtoken")?.value;
    } else {
        const readOnlyHeaders = await headers();
        if (!readOnlyHeaders.has("Authorization")) {
            throw new Error("Missing auth header");
        }
        authHeader = readOnlyHeaders.get("Authorization");
    }
    return authHeader;
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
        logger.error(`Something happened during fetch in RootLayout. Error: ${e}`);
    }
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: SupportedLocale }>;
}) {
    const { locale } = await params;
    const props = decoratorParams(locale);
    const Decorator = await fetchDecoratorReact(props);

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const flags = await getFlagsServerSide();

    const harTilgangResponse = await harTilgang();
    return (
        <html lang={locale || "no"}>
            <head>
                <Decorator.HeadAssets />
                <link rel="icon" href="https://www.nav.no/favicon.ico" type="image/x-icon" />
            </head>
            <Preload />
            <body>
                <Decorator.Header />
                <NextIntlClientProvider>
                    <Providers toggles={flags.toggles} tilgang={harTilgangResponse}>
                        {children}
                    </Providers>
                </NextIntlClientProvider>
                <Decorator.Footer />
                <Decorator.Scripts loader={Script} />
            </body>
        </html>
    );
}

export const metadata = {
    title: "Økonomisk sosialhjelp",
};
