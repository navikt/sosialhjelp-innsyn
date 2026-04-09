import React, { Suspense } from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { prefetchHentVedleggQuery } from "@generated/ssr/vedlegg-controller/vedlegg-controller";
import { getQueryClient } from "@api/queryClient";
import { prefetchHentSaksStatuserQuery } from "@generated/ssr/saks-status-controller/saks-status-controller";
import {
    hentSoknadsStatus,
    prefetchHentOriginalSoknadQuery,
} from "@generated/ssr/soknads-status-controller/soknads-status-controller";
import { prefetchHentKlagerQuery } from "@generated/ssr/klage-controller/klage-controller";
import {
    prefetchGetDokumentasjonkravBetaQuery,
    prefetchGetOppgaverBetaQuery,
    prefetchGetVilkarQuery,
} from "@generated/ssr/oppgave-controller-v-2/oppgave-controller-v-2";
import { getFlag, getToggles } from "@featuretoggles/unleash";

import Oversikt from "./oversikt/Oversikt";
import Filopplasting, { FilopplastingSkeleton } from "./dokumenter/Filopplasting";
import Oppgaver, { OppgaverSkeleton } from "./oppgaver/Oppgaver";
import VilkarListe from "./vilkar/VilkarListe";
import Saker from "./saker/Saker";
import BrevFraNav, { BrevFraNavSkeleton } from "./brevfranav/BrevFraNav";
import Snarveier from "@components/snarveier/Snarveier";
import SoknadSnarveier from "./snarveier/SoknadSnarveier";
import TagsAdapter from "./tags/TagsAdapter";
import { prefetchGetSaksDetaljerQuery } from "@generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import { TagsSkeleton } from "@components/tags/Tags";
import SoknadInfoCards from "./info/SoknadInfoCards";
import { prefetchHentBrevQuery } from "@generated/ssr/brev-controller/brev-controller";

interface Props {
    id: string;
}

export const Soknad = async ({ id }: Props) => {
    const t = await getTranslations("Soknad");
    const vedleggQueryClient = getQueryClient();
    const oppgaverQueryClient = getQueryClient();
    const dokumentasjonkravQueryClient = getQueryClient();
    const klageQueryClient = getQueryClient();
    const saksdetaljerQueryClient = getQueryClient();
    const sakerQueryClient = getQueryClient();
    const brevQueryClient = getQueryClient();

    const { status, navKontor, tittel } = await hentSoknadsStatus(id);
    const mottattOrSendt = ["SENDT", "MOTTATT"].includes(status);

    // Fetch feature flag flyttet ut av FIlopplasting komponenten
    const toggles = await getToggles();
    const nyUploadToggle = getFlag("sosialhjelp.innsyn.ny_upload", toggles);
    const klageToggle = getFlag("sosialhjelp.innsyn.klage", toggles);
    const newUploadEnabled = nyUploadToggle?.enabled ?? false;

    // Prefetcher her og putter det i HydrationBoundary slik at det er tilgjengelig i browseren
    prefetchHentVedleggQuery(vedleggQueryClient, id);
    prefetchHentOriginalSoknadQuery(vedleggQueryClient, id);
    prefetchGetOppgaverBetaQuery(oppgaverQueryClient, id);
    prefetchGetDokumentasjonkravBetaQuery(dokumentasjonkravQueryClient, id);
    prefetchGetVilkarQuery(dokumentasjonkravQueryClient, id);
    prefetchHentSaksStatuserQuery(sakerQueryClient, id);
    prefetchGetSaksDetaljerQuery(saksdetaljerQueryClient, id);
    prefetchHentBrevQuery(brevQueryClient, id);
    if (klageToggle.enabled) {
        prefetchHentKlagerQuery(klageQueryClient, id, { query: { enabled: !mottattOrSendt } });
    }

    return (
        <VStack gap={{ xs: "space-48", md: "space-80" }} className="mt-20">
            <VStack gap="space-16">
                <Heading size="xlarge" level="1" lang={tittel ? "no" : undefined}>
                    {tittel ?? t("defaultTittel")}
                </Heading>
                <Suspense fallback={<TagsSkeleton size="medium" />}>
                    <HydrationBoundary state={dehydrate(saksdetaljerQueryClient)}>
                        <TagsAdapter />
                    </HydrationBoundary>
                </Suspense>
            </VStack>
            <Suspense fallback={null}>
                <HydrationBoundary state={dehydrate(saksdetaljerQueryClient)}>
                    <HydrationBoundary state={dehydrate(oppgaverQueryClient)}>
                        <SoknadInfoCards navKontor={navKontor} />
                    </HydrationBoundary>
                </HydrationBoundary>
            </Suspense>
            <Suspense fallback={null}>
                <HydrationBoundary state={dehydrate(klageQueryClient)}>
                    <HydrationBoundary state={dehydrate(sakerQueryClient)}>
                        <Saker />
                    </HydrationBoundary>
                </HydrationBoundary>
            </Suspense>
            {status !== "FERDIGBEHANDLET" && status !== "BEHANDLES_IKKE" && (
                <Suspense fallback={<OppgaverSkeleton />}>
                    <HydrationBoundary state={dehydrate(oppgaverQueryClient)}>
                        <Oppgaver />
                    </HydrationBoundary>
                </Suspense>
            )}
            <Suspense fallback={null}>
                <HydrationBoundary state={dehydrate(dokumentasjonkravQueryClient)}>
                    <VilkarListe />
                </HydrationBoundary>
            </Suspense>
            <Suspense fallback={<FilopplastingSkeleton />}>
                <HydrationBoundary state={dehydrate(vedleggQueryClient)}>
                    <HydrationBoundary state={dehydrate(sakerQueryClient)}>
                        <Filopplasting id={id} newUploadEnabled={newUploadEnabled} soknadStatus={status} />
                    </HydrationBoundary>
                </HydrationBoundary>
            </Suspense>
            <Suspense fallback={<BrevFraNavSkeleton soknadStatus={status} />}>
                <HydrationBoundary state={dehydrate(brevQueryClient)}>
                    <BrevFraNav />
                </HydrationBoundary>
            </Suspense>
            <Oversikt id={id} />
            <Snarveier hideSokButton={true}>
                <SoknadSnarveier />
            </Snarveier>
        </VStack>
    );
};
