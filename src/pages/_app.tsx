import React, { useEffect } from "react";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { appWithTranslation } from "next-i18next";
import { useRouter } from "next/router";
import "../index.css";
import { onBreadcrumbClick, onLanguageSelect, setParams } from "@navikt/nav-dekoratoren-moduler";
import { configureLogger } from "@navikt/next-logger";
import Cookies from "js-cookie";

import ErrorBoundary from "../components/errors/ErrorBoundary";
import Tilgangskontrollside from "../components/Tilgangskontrollside/Tilgangskontrollside";
import { FlagProvider } from "../featuretoggles/context";
import { logBrukerDefaultLanguage, logBrukerSpraakChange } from "../utils/amplitude";
import { getFaro, initInstrumentation, pinoLevelToFaroLevel } from "../faro/faro";
import { PageProps } from "../pagehandler/pageHandler";

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

const App = ({ Component, pageProps }: AppProps<PageProps>): React.JSX.Element => {
    const router = useRouter();
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            })
    );
    useEffect(() => {
        setParams({
            logoutUrl: process.env.NEXT_PUBLIC_DEKORATOREN_LOGOUT_URL || undefined,
            redirectToUrlLogout: process.env.NEXT_PUBLIC_DEKORATOREN_LOGOUT_URL || undefined,
        });
    }, []);
    onLanguageSelect(async (option) => {
        logBrukerSpraakChange(option.locale);
        return router.replace(router.asPath, undefined, { locale: option.locale });
    });
    onBreadcrumbClick((breadcrumb) => router.push(breadcrumb.url));

    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={pageProps.dehydratedState}>
                <ErrorBoundary>
                    <FlagProvider toggles={pageProps.toggles}>
                        <Tilgangskontrollside harTilgang={pageProps.tilgang}>
                            <div role="main" tabIndex={-1} id="maincontent">
                                <Component {...pageProps}></Component>
                            </div>
                        </Tilgangskontrollside>
                    </FlagProvider>
                </ErrorBoundary>
            </HydrationBoundary>
        </QueryClientProvider>
    );
};

export default appWithTranslation(App);
