import React from "react";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { useRouter } from "next/router";
import "../index.css";
import { onBreadcrumbClick, onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import { configureLogger } from "@navikt/next-logger";
import Cookies from "js-cookie";
import { NextIntlClientProvider } from "next-intl";

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
    // Default options for query clienten blir satt i orval.config.ts
    const [queryClient] = React.useState(() => new QueryClient());
    onLanguageSelect(async (option) => {
        logBrukerSpraakChange(option.locale);
        await router.replace(router.asPath.replace(/\/(en|nn|nb)/, `/`), undefined, { locale: option.locale });
        router.reload();
    });
    onBreadcrumbClick((breadcrumb) => router.push(breadcrumb.url));
    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={pageProps.dehydratedState}>
                <NextIntlClientProvider
                    locale={router.locale || "nb"}
                    messages={pageProps.messages}
                    timeZone="Europe/Oslo"
                >
                    <ErrorBoundary>
                        <FlagProvider toggles={pageProps.toggles}>
                            <Tilgangskontrollside harTilgang={pageProps.tilgang}>
                                <div role="main" tabIndex={-1} id="maincontent">
                                    <Component {...pageProps}></Component>
                                </div>
                            </Tilgangskontrollside>
                        </FlagProvider>
                    </ErrorBoundary>
                </NextIntlClientProvider>
            </HydrationBoundary>
        </QueryClientProvider>
    );
};

export default App;
