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

import Tilgangskontrollside from "../components/Tilgangskontrollside/Tilgangskontrollside";
import { FlagProvider } from "../featuretoggles/context";
import { logBrukerDefaultLanguage, logBrukerSpraakChange } from "../utils/amplitude";

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
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
                    <Tilgangskontrollside>
                        <div role="main" tabIndex={-1} id="maincontent">
                            <Component {...pageProps}></Component>
                        </div>
                    </Tilgangskontrollside>
                </FlagProvider>
            </ErrorBoundary>
        </QueryClientProvider>
    );
};

export default appWithTranslation(App);
