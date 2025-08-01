import "./globals.css";

import { DecoratorFetchProps, fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Script from "next/script";
import { cookies } from "next/headers";
import { Page, PageBlock } from "@navikt/ds-react/Page";
import { PropsWithChildren } from "react";

import { getBaseCrumbs } from "../utils/breadcrumbs";
import { DECORATOR_LOCALE_COOKIE_NAME, isSupportedLocale, SupportedLocale } from "../i18n/common";

import Preload from "./preload";
import { Theme } from "@navikt/ds-react";

export const dynamic = "force-dynamic";

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
        breadcrumbs: getBaseCrumbs(),
        logoutWarning: false,
    },
});

export default async function RootLayout({ children }: PropsWithChildren) {
    const jar = await cookies();
    const cookie = jar.get(DECORATOR_LOCALE_COOKIE_NAME)?.value;
    const locale = cookie && isSupportedLocale(cookie) ? cookie : "nb";

    const props = decoratorParams(locale);
    const Decorator = await fetchDecoratorReact(props);

    return (
        <html lang={locale || "nb"}>
            <head>
                <Script
                    defer
                    strategy="afterInteractive"
                    src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
                    data-host-url="https://umami.nav.no"
                    data-website-id={process.env.UMAMI_ID}
                ></Script>
                <Decorator.HeadAssets />
                <link rel="icon" href="https://www.nav.no/favicon.ico" type="image/x-icon" />
            </head>
            <Preload />
            <body>
                <Theme>
                    <Page footer={<Decorator.Footer />}>
                        <Decorator.Header />
                        <PageBlock as="main" width="md" gutters>
                            {children}
                        </PageBlock>
                    </Page>
                </Theme>
                <Decorator.Scripts loader={Script} />
            </body>
        </html>
    );
}
