import React, { Suspense } from "react";
import { Bleed, BoxNew, Heading, VStack } from "@navikt/ds-react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { prefetchHentVedleggQuery } from "@generated/ssr/vedlegg-controller/vedlegg-controller";
import { getQueryClient } from "@api/queryClient";
import {
    getVilkar,
    prefetchGetDokumentasjonkravBetaQuery,
    prefetchGetOppgaverBetaQuery,
} from "@generated/ssr/oppgave-controller/oppgave-controller";
import { hentSaksStatuser } from "@generated/ssr/saks-status-controller/saks-status-controller";
import { hentForelopigSvarStatus } from "@generated/ssr/forelopig-svar-controller/forelopig-svar-controller";
import {
    hentSoknadsStatus,
    prefetchHentOriginalSoknadQuery,
} from "@generated/ssr/soknads-status-controller/soknads-status-controller";
import { hentKlager } from "@generated/ssr/klage-controller/klage-controller";

import Oversikt from "./oversikt/Oversikt";
import Dokumenter, { DokumenterSkeleton } from "./dokumenter/Dokumenter";
import Filopplasting from "./dokumenter/Filopplasting";
import Oppgaver, { OppgaverSkeleton } from "./oppgaver/Oppgaver";
import Saker from "./saker/Saker";
import InfoAlert from "./alert/InfoAlert";
import ForelopigSvarAlert from "./alert/ForelopigSvarAlert";
import ForelopigSvar from "./forelopigsvar/ForelopigSvar";
import DeltSoknadAlert from "./saker/DeltSoknadAlert";
import OppgaveAlert from "./oppgaver/OppgaveAlert";
import VilkarAlert from "./alert/VilkarAlert";

interface Props {
    id: string;
}

export const Soknad = async ({ id }: Props) => {
    const t = await getTranslations("Soknad");
    const vedleggQueryClient = getQueryClient();
    const oppgaverQueryClient = getQueryClient();
    const dokumentasjonkravQueryClient = getQueryClient();

    const { status, navKontor, tittel } = await hentSoknadsStatus(id);
    const mottattOrSendt = ["SENDT", "MOTTATT"].includes(status);
    const ferdigbehandlet = status === "FERDIGBEHANDLET";
    // Prefetcher her og putter det i HydrationBoundary slik at det er tilgjengelig i browseren
    prefetchHentVedleggQuery(vedleggQueryClient, id);
    prefetchHentOriginalSoknadQuery(vedleggQueryClient, id);
    prefetchGetOppgaverBetaQuery(oppgaverQueryClient, id);
    prefetchGetDokumentasjonkravBetaQuery(dokumentasjonkravQueryClient, id);
    const forelopigSvarPromise = !ferdigbehandlet && hentForelopigSvarStatus(id);
    const vilkarPromise = getVilkar(id);
    const sakerPromise = !mottattOrSendt && hentSaksStatuser(id);
    const klagerPromise = !mottattOrSendt && hentKlager(id);
    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1" lang={tittel ? "no" : ""}>
                {tittel ?? t("defaultTittel")}
            </Heading>
            <VStack gap="2">
                {forelopigSvarPromise && (
                    <Suspense fallback={null}>
                        <ForelopigSvarAlert
                            forelopigSvarPromise={forelopigSvarPromise}
                            navKontor={navKontor ?? "Ditt Nav-kontor"}
                        />
                    </Suspense>
                )}
                <Suspense fallback={null}>
                    <HydrationBoundary state={dehydrate(oppgaverQueryClient)}>
                        <OppgaveAlert />
                    </HydrationBoundary>
                </Suspense>
                <InfoAlert navKontor={navKontor} soknadstatus={status} sakerPromise={sakerPromise} />
                {vilkarPromise && <VilkarAlert vilkarPromise={vilkarPromise} />}
                {sakerPromise && (
                    <Suspense fallback={null}>
                        <DeltSoknadAlert sakerPromise={sakerPromise} />
                    </Suspense>
                )}
            </VStack>
            {forelopigSvarPromise && (
                <Suspense fallback={null}>
                    <ForelopigSvar forelopigSvarPromise={forelopigSvarPromise} />
                </Suspense>
            )}
            {sakerPromise && klagerPromise && (
                <Suspense fallback={null}>
                    <HydrationBoundary state={dehydrate(dokumentasjonkravQueryClient)}>
                        <Saker
                            sakerPromise={sakerPromise}
                            vilkarPromise={vilkarPromise}
                            klagerPromise={klagerPromise}
                        />
                    </HydrationBoundary>
                </Suspense>
            )}
            <Suspense fallback={<OppgaverSkeleton />}>
                <HydrationBoundary state={dehydrate(oppgaverQueryClient)}>
                    <Oppgaver />
                </HydrationBoundary>
            </Suspense>
            <Filopplasting id={id} />
            <Bleed marginInline="full" className="pt-20 pb-20" marginBlock="space-0 space-64" asChild>
                <BoxNew background="neutral-soft" padding="space-24" className="flex-1">
                    <div className="max-w-2xl mx-auto">
                        <VStack gap="20">
                            <Oversikt id={id} />
                            <Suspense fallback={<DokumenterSkeleton />}>
                                <HydrationBoundary state={dehydrate(vedleggQueryClient)}>
                                    <Dokumenter />
                                </HydrationBoundary>
                            </Suspense>
                        </VStack>
                    </div>
                </BoxNew>
            </Bleed>
        </VStack>
    );
};
