"use client";

import React, { PropsWithChildren } from "react";
import { DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

    onLanguageSelect(async (option) => {
        logBrukerSpraakChange(option.locale);
        router.replace(pathname.replace(/\/(en|nn|nb)/, "/"));
        return router.refresh();
    });

    onBreadcrumbClick((breadcrumb) => router.push(breadcrumb.url));
    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
                <FlagProvider toggles={toggles}>
                    <TilgangskontrollsideApp harTilgang={tilgang}>{children}</TilgangskontrollsideApp>
                </FlagProvider>
            </HydrationBoundary>
        </QueryClientProvider>
    );
};

export default Providers;
