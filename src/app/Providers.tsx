"use client";

import React, { PropsWithChildren } from "react";
import { DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onBreadcrumbClick, onLanguageSelect, setParams } from "@navikt/nav-dekoratoren-moduler";
import { configureLogger } from "@navikt/next-logger";
import Cookies from "js-cookie";
import { IToggle } from "@unleash/nextjs";
import { usePathname, useRouter } from "next/navigation";

import ErrorBoundary from "../components/errors/ErrorBoundary";
import { FlagProvider } from "../featuretoggles/context";
import { logBrukerDefaultLanguage, logBrukerSpraakChange } from "../utils/amplitude";
import { getFaro, initInstrumentation, pinoLevelToFaroLevel } from "../faro/faro";
import { TilgangResponse } from "../generated/model";
import TilgangskontrollsideApp from "../components/Tilgangskontrollside/TilgangskontrollsideApp";
import { useSetBreadcrumbs } from "../hooks/useUpdateBreadcrumbs";

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
    const pathname = usePathname();
    useSetBreadcrumbs();
    // Default options for query clienten blir satt i orval.config.ts
    const [queryClient] = React.useState(() => new QueryClient());
    // TODO: Fiks dette, funker ikke
    onLanguageSelect(({ locale: language, url }) => {
        logBrukerSpraakChange(language);
        setParams({ language }).then(() => window.location.assign(`${url}${pathname}`));
    });

    onBreadcrumbClick((breadcrumb) => router.push(breadcrumb.url));
    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
                <ErrorBoundary>
                    <FlagProvider toggles={toggles}>
                        <TilgangskontrollsideApp harTilgang={tilgang}>
                            <div role="main" tabIndex={-1} id="maincontent">
                                {children}
                            </div>
                        </TilgangskontrollsideApp>
                    </FlagProvider>
                </ErrorBoundary>
            </HydrationBoundary>
        </QueryClientProvider>
    );
};

export default Providers;
