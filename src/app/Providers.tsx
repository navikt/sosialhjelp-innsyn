import { useRouter } from "next/router";

("use-client");

import React, { PropsWithChildren } from "react";
import { DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onBreadcrumbClick, onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import { configureLogger } from "@navikt/next-logger";
import Cookies from "js-cookie";
import { IToggle } from "@unleash/nextjs";

import ErrorBoundary from "../components/errors/ErrorBoundary";
import { FlagProvider } from "../featuretoggles/context";
import Tilgangskontrollside from "../components/Tilgangskontrollside/Tilgangskontrollside";
import { logBrukerDefaultLanguage, logBrukerSpraakChange } from "../utils/amplitude";
import { getFaro, initInstrumentation, pinoLevelToFaroLevel } from "../faro/faro";
import { TilgangResponse } from "../generated/model";

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

interface Props {
    // TODO: Påkrevd? Må kanskje flytte HydrationBoundary lenger inn i layout-hierarkiet
    dehydratedState?: DehydratedState;
    toggles: IToggle[];
    tilgang?: TilgangResponse;
}

const Providers = ({ dehydratedState, toggles, tilgang, children }: PropsWithChildren<Props>) => {
    const router = useRouter();
    // Default options for query clienten blir satt i orval.config.ts
    const [queryClient] = React.useState(() => new QueryClient());
    onLanguageSelect(async (option) => {
        logBrukerSpraakChange(option.locale);
        return router.replace(router.asPath, undefined, { locale: option.locale });
    });
    onBreadcrumbClick((breadcrumb) => router.push(breadcrumb.url));
    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
                <ErrorBoundary>
                    <FlagProvider toggles={toggles}>
                        <Tilgangskontrollside harTilgang={tilgang}>
                            <div role="main" tabIndex={-1} id="maincontent">
                                {children}
                            </div>
                        </Tilgangskontrollside>
                    </FlagProvider>
                </ErrorBoundary>
            </HydrationBoundary>
        </QueryClientProvider>
    );
};

export default Providers;
