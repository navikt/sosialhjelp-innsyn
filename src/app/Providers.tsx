"use client";

import React, { PropsWithChildren, use, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { onBreadcrumbClick, onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import { configureLogger } from "@navikt/next-logger";
import { IToggle } from "@unleash/nextjs";
import { useRouter } from "next/navigation";
import { FlagProvider } from "@featuretoggles/context";
import { getFaro, initInstrumentation, pinoLevelToFaroLevel } from "@faro/faro";
import { TilgangResponse } from "@generated/model";
import TilgangskontrollsideApp from "@components/Tilgangskontrollside/Tilgangskontrollside";
import { getQueryClient } from "@api/queryClient";
import { LiveAnnouncerProvider } from "@components/liveAnnouncer/LiveAnnouncer";

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
    // Default options for query clienten blir satt i orval.config.ts
    const queryClient = getQueryClient();

    useEffect(() => {
        onBreadcrumbClick((breadcrumb) => router.push(breadcrumb.url));
        onLanguageSelect(({ locale }) => {
            if (isSupportedLocale(locale)) {
                router.refresh();
            }
        });
    }, [router]);

    return (
        <QueryClientProvider client={queryClient}>
            <FlagProvider toggles={toggles}>
                <LiveAnnouncerProvider>
                    <TilgangskontrollsideApp harTilgang={harTilgang}>{children}</TilgangskontrollsideApp>
                </LiveAnnouncerProvider>
            </FlagProvider>
        </QueryClientProvider>
    );
};

export default Providers;
