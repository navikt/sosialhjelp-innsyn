import React from "react";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appWithTranslation } from "next-i18next";
import { useRouter } from "next/router";
import "../index.css";
import { onBreadcrumbClick, onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import { configureLogger } from "@navikt/next-logger";
import Cookies from "js-cookie";
import { IToggle } from "@unleash/nextjs";

import ErrorBoundary from "../components/errors/ErrorBoundary";
import { FlagProvider } from "../featuretoggles/context";
import { logBrukerDefaultLanguage, logBrukerSpraakChange } from "../utils/amplitude";
import { getFaro, initInstrumentation, pinoLevelToFaroLevel } from "../faro/faro";
import { TilgangskontrollsideWrapper } from "../components/Tilgangskontrollside/TilgangskontrollsideWrapper";

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

initInstrumentation();
configureLogger({
    basePath: "/sosialhjelp/innsyn",
    onLog: (log) =>
        getFaro()?.api.pushLog(log.messages, {
            level: pinoLevelToFaroLevel(log.level.label),
        }),
});
configureLogger({
    basePath: "/sosialhjelp/innsyn",
});

// TODO: Dette er kanskje ikke den beste plassering
logBrukerDefaultLanguage(Cookies.get("decorator-language"));

const App = ({ Component, pageProps }: AppProps<{ toggles: IToggle[] }>): React.JSX.Element => {
    const router = useRouter();
    onLanguageSelect(async (option) => {
        logBrukerSpraakChange(option.locale);
        return router.replace(router.asPath, undefined, { locale: option.locale });
    });
    onBreadcrumbClick((breadcrumb) => router.push(breadcrumb.url));
    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <FlagProvider toggles={pageProps.toggles}>
                    <TilgangskontrollsideWrapper>
                        <div role="main" tabIndex={-1} id="maincontent">
                            <Component {...pageProps}></Component>
                        </div>
                    </TilgangskontrollsideWrapper>
                </FlagProvider>
            </ErrorBoundary>
        </QueryClientProvider>
    );
};

export default appWithTranslation(App);
