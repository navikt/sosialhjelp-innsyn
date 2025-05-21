import { PropsWithChildren } from "react";
import { DecoratorFetchProps, fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Script from "next/script";

import { getBaseCrumbs } from "../utils/breadcrumbs";
import { routing } from "../i18n/routing";

import Preload from "./preload";

type SupportedLocale = (typeof routing.locales)[number];

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

interface Props {
    locale?: SupportedLocale;
}

const Dekoratoren = async ({ children, locale = "nb" }: PropsWithChildren<Props>) => {
    const props = decoratorParams(locale);
    const Decorator = await fetchDecoratorReact(props);
    return (
        <html lang={locale || "nb"}>
            <head>
                <Decorator.HeadAssets />
                <link rel="icon" href="https://www.nav.no/favicon.ico" type="image/x-icon" />
            </head>
            <Preload />
            <body>
                <Decorator.Header />
                <main tabIndex={-1} id="maincontent" className="max-w-2xl ml-auto mr-auto">
                    {children}
                </main>
                <Decorator.Footer />
                <Decorator.Scripts loader={Script} />
            </body>
        </html>
    );
};

export default Dekoratoren;
