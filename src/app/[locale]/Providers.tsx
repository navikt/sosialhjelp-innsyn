"use client";

import React, { PropsWithChildren, use } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { onBreadcrumbClick, onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import { configureLogger } from "@navikt/next-logger";
import { IToggle } from "@unleash/nextjs";
import { usePathname, useRouter } from "next/navigation";

import { FlagProvider } from "@featuretoggles/context";
import { getFaro, initInstrumentation, pinoLevelToFaroLevel } from "@faro/faro";
import { TilgangResponse } from "@generated/model";
import TilgangskontrollsideApp from "@components/Tilgangskontrollside/TilgangskontrollsideApp";
import { getQueryClient } from "@api/queryClient";

initInstrumentation();
configureLogger({
    basePath: "/sosialhjelp/innsyn",
    onLog: (log) =>
        getFaro()?.api.pushLog(log.messages, {
            level: pinoLevelToFaroLevel(log.level.label),
        }),
});

interface Props {
    togglesPromise: Promise<IToggle[]>;
    tilgang: Promise<TilgangResponse | undefined>;
}

const Providers = ({ togglesPromise, tilgang, children }: PropsWithChildren<Props>) => {
    const harTilgang = use(tilgang);
    const toggles = use(togglesPromise);
    const router = useRouter();
    const pathname = usePathname();
    // Default options for query clienten blir satt i orval.config.ts
    const queryClient = getQueryClient();

    onLanguageSelect(async () => {
        router.replace(pathname.replace(/\/(en|nn|nb)/, "/"));
        return router.refresh();
    });

    onBreadcrumbClick((breadcrumb) => router.push(breadcrumb.url));
    return (
        <QueryClientProvider client={queryClient}>
            <FlagProvider toggles={toggles}>
                <TilgangskontrollsideApp harTilgang={harTilgang}>{children}</TilgangskontrollsideApp>
            </FlagProvider>
        </QueryClientProvider>
    );
};

export default Providers;
