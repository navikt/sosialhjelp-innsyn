"use client";

import React, { PropsWithChildren } from "react";
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onBreadcrumbClick, onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import { configureLogger } from "@navikt/next-logger";
import Cookies from "js-cookie";
import { IToggle } from "@unleash/nextjs";
import { usePathname, useRouter } from "next/navigation";

import { FlagProvider } from "../../featuretoggles/context";
import { logBrukerDefaultLanguage, logBrukerSpraakChange } from "../../utils/amplitude";
import { getFaro, initInstrumentation, pinoLevelToFaroLevel } from "../../faro/faro";
import { TilgangResponse } from "../../generated/model";
import TilgangskontrollsideApp from "../../components/Tilgangskontrollside/TilgangskontrollsideApp";
import { useSetBreadcrumbs } from "../../hooks/useUpdateBreadcrumbs";

initInstrumentation();
configureLogger({
    basePath: "/sosialhjelp/innsyn",
    onLog: (log) =>
        getFaro()?.api.pushLog(log.messages, {
            level: pinoLevelToFaroLevel(log.level.label),
        }),
});

logBrukerDefaultLanguage(Cookies.get("decorator-language"));

interface Props {
    toggles: IToggle[];
    tilgang?: TilgangResponse;
}

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 60 * 1000,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important, so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

const Providers = ({ toggles, tilgang, children }: PropsWithChildren<Props>) => {
    const router = useRouter();
    const pathname = usePathname();
    useSetBreadcrumbs();
    // Default options for query clienten blir satt i orval.config.ts
    const queryClient = getQueryClient();

    onLanguageSelect(async (option) => {
        logBrukerSpraakChange(option.locale);
        router.replace(pathname.replace(/\/(en|nn|nb)/, "/"));
        return router.refresh();
    });

    onBreadcrumbClick((breadcrumb) => router.push(breadcrumb.url));
    return (
        <QueryClientProvider client={queryClient}>
            <FlagProvider toggles={toggles}>
                <TilgangskontrollsideApp harTilgang={tilgang}>{children}</TilgangskontrollsideApp>
            </FlagProvider>
        </QueryClientProvider>
    );
};

export default Providers;
