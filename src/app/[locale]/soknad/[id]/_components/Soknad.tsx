import React, { Suspense } from "react";
import { Heading, VStack } from "@navikt/ds-react";
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
import { SoknadsStatusResponseStatus } from "@generated/ssr/model";
import { hentForelopigSvarStatus } from "@generated/ssr/forelopig-svar-controller/forelopig-svar-controller";
import { prefetchHentOriginalSoknadQuery } from "@generated/ssr/soknads-status-controller/soknads-status-controller";

import Oversikt from "./oversikt/Oversikt";
import Dokumenter, { DokumenterSkeleton } from "./dokumenter/Dokumenter";
import Filopplasting from "./dokumenter/Filopplasting";
import Oppgaver, { OppgaverSkeleton } from "./oppgaver/Oppgaver";
import Saker, { SakerSkeleton } from "./saker/Saker";
import InfoAlert from "./alert/InfoAlert";
import ForelopigSvarAlert from "./alert/ForelopigSvarAlert";
import ForelopigSvar from "./forelopigsvar/ForelopigSvar";
import DeltSoknadAlert from "./saker/DeltSoknadAlert";
import OppgaveAlert from "./oppgaver/OppgaveAlert";
import { SoknadFile } from "./dokumenter/VedleggListe";

interface Props {
    id: string;
    soknadstatus: SoknadsStatusResponseStatus;
    navKontor?: string;
    soknadFile?: SoknadFile;
}

export const Soknad = async ({ id, soknadstatus, navKontor }: Props) => {
    const t = await getTranslations("Soknad");
    const vedleggQueryClient = getQueryClient();
    const oppgaverQueryClient = getQueryClient();
    const dokumentasjonkravQueryClient = getQueryClient();

    const mottattOrSendt = ["SENDT", "MOTTATT"].includes(soknadstatus);
    const ferdigbehandlet = soknadstatus === "FERDIGBEHANDLET";
    // Prefetcher her og putter det i HydrationBoundary slik at det er tilgjengelig i browseren
    prefetchHentVedleggQuery(vedleggQueryClient, id);
    prefetchHentOriginalSoknadQuery(vedleggQueryClient, id);
    prefetchGetOppgaverBetaQuery(oppgaverQueryClient, id);
    prefetchGetDokumentasjonkravBetaQuery(dokumentasjonkravQueryClient, id);
    const forelopigSvarPromise = ferdigbehandlet && hentForelopigSvarStatus(id);
    const vilkarPromise = getVilkar(id);
    const sakerPromise = !mottattOrSendt && hentSaksStatuser(id);
    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1">
                {t(`tittel.${soknadstatus}`)}
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
                <InfoAlert navKontor={navKontor} soknadstatus={soknadstatus} />
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
            {sakerPromise && (
                <Suspense fallback={<SakerSkeleton />}>
                    <HydrationBoundary state={dehydrate(dokumentasjonkravQueryClient)}>
                        <Saker sakerPromise={sakerPromise} vilkarPromise={vilkarPromise} />
                    </HydrationBoundary>
                </Suspense>
            )}
            <Suspense fallback={<OppgaverSkeleton />}>
                <HydrationBoundary state={dehydrate(oppgaverQueryClient)}>
                    <Oppgaver />
                </HydrationBoundary>
            </Suspense>
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
