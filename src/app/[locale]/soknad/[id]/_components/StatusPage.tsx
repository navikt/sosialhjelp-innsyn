import React, { PropsWithChildren, Suspense } from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { prefetchHentVedleggQuery } from "@generated/ssr/vedlegg-controller/vedlegg-controller";
import { getQueryClient } from "@api/queryClient";
import { getVilkar, prefetchGetOppgaverBetaQuery } from "@generated/ssr/oppgave-controller/oppgave-controller";
import { hentSaksStatuser } from "@generated/ssr/saks-status-controller/saks-status-controller";
import { SoknadsStatusResponseStatus } from "@generated/ssr/model";

import Oversikt from "./oversikt/Oversikt";
import Dokumenter, { DokumenterSkeleton } from "./dokumenter/Dokumenter";
import Filopplasting from "./dokumenter/Filopplasting";
import Oppgaver, { OppgaverSkeleton } from "./oppgaver/Oppgaver";
import Saker, { SakerSkeleton } from "./saker/Saker";
import InfoAlert from "./alert/InfoAlert";

interface Props {
    id: string;
    soknadstatus: SoknadsStatusResponseStatus;
    navKontor?: string;
}

export const StatusPage = async ({ id, children, soknadstatus, navKontor }: PropsWithChildren<Props>) => {
    const t = await getTranslations("StatusPage");
    const vedleggQueryClient = getQueryClient();
    const oppgaverQueryClient = getQueryClient();

    const mottattOrSendt = ["SENDT", "MOTTATT"].includes(soknadstatus);
    // Prefetcher her og putter det i HydrationBoundary slik at det er tilgjengelig i browseren
    prefetchHentVedleggQuery(vedleggQueryClient, id);
    prefetchGetOppgaverBetaQuery(oppgaverQueryClient, id);
    const vilkarPromise = getVilkar(id);
    const sakerPromise = !mottattOrSendt && hentSaksStatuser(id);
    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1">
                {t(`tittel.${soknadstatus}`)}
            </Heading>

            <InfoAlert navKontor={navKontor} soknadstatus={soknadstatus} />
            <Suspense fallback={<OppgaverSkeleton />}>
                <HydrationBoundary state={dehydrate(oppgaverQueryClient)}>
                    <Oppgaver />
                </HydrationBoundary>
            </Suspense>
            {sakerPromise && (
                <Suspense fallback={<SakerSkeleton />}>
                    <Saker sakerPromise={sakerPromise} vilkarPromise={vilkarPromise} />
                </Suspense>
            )}
            {children}
            <Oversikt id={id} />
            <Filopplasting />
            <Suspense fallback={<DokumenterSkeleton />}>
                <HydrationBoundary state={dehydrate(vedleggQueryClient)}>
                    <Dokumenter />
                </HydrationBoundary>
            </Suspense>
        </VStack>
    );
};
