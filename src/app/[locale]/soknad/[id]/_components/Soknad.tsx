import React, { Suspense } from "react";
import { Bleed, Box, Heading, VStack } from "@navikt/ds-react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { prefetchHentVedleggQuery } from "@generated/ssr/vedlegg-controller/vedlegg-controller";
import { getQueryClient } from "@api/queryClient";
import { hentSaksStatuser } from "@generated/ssr/saks-status-controller/saks-status-controller";
import { hentForelopigSvarStatus } from "@generated/ssr/forelopig-svar-controller/forelopig-svar-controller";
import {
    hentSoknadsStatus,
    prefetchHentOriginalSoknadQuery,
} from "@generated/ssr/soknads-status-controller/soknads-status-controller";
import { hentKlager, prefetchHentKlagerQuery } from "@generated/ssr/klage-controller/klage-controller";
import {
    prefetchGetDokumentasjonkravBetaQuery,
    prefetchGetOppgaverBetaQuery,
    getVilkar,
} from "@generated/ssr/oppgave-controller-v-2/oppgave-controller-v-2";

import Oversikt from "./oversikt/Oversikt";
import Dokumenter, { DokumenterSkeleton } from "./dokumenter/Dokumenter";
import Filopplasting from "./dokumenter/Filopplasting";
import Oppgaver, { OppgaverSkeleton } from "./oppgaver/Oppgaver";
import Saker from "./saker/Saker";
import ForelopigSvar from "./forelopigsvar/ForelopigSvar";
import SoknadenDin, { SoknadenDinSkeleton } from "./dokumenter/SoknadenDin";
import Snarveier from "@components/snarveier/Snarveier";
import SoknadSnarveier from "./snarveier/SoknadSnarveier";
import TagsAdapter from "./tags/TagsAdapter";
import { prefetchGetSaksDetaljerQuery } from "@generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import { TagsSkeleton } from "@components/tags/Tags";
import SoknadInfoCards from "./info/SoknadInfoCards";

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

    const { status, navKontor, tittel } = await hentSoknadsStatus(id);
    const mottattOrSendt = ["SENDT", "MOTTATT"].includes(status);
    const ferdigbehandlet = status === "FERDIGBEHANDLET";
    // Prefetcher her og putter det i HydrationBoundary slik at det er tilgjengelig i browseren
    prefetchHentVedleggQuery(vedleggQueryClient, id);
    prefetchHentOriginalSoknadQuery(vedleggQueryClient, id);
    prefetchGetOppgaverBetaQuery(oppgaverQueryClient, id);
    prefetchGetDokumentasjonkravBetaQuery(dokumentasjonkravQueryClient, id);
    prefetchHentKlagerQuery(klageQueryClient, id, { query: { enabled: !mottattOrSendt } });
    prefetchGetSaksDetaljerQuery(saksdetaljerQueryClient, id);
    const forelopigSvarPromise = !ferdigbehandlet && hentForelopigSvarStatus(id);
    const vilkarPromise = getVilkar(id);
    const sakerPromise = !mottattOrSendt && hentSaksStatuser(id);
    const klagerPromise = !mottattOrSendt && hentKlager(id);

    return (
        <VStack gap="space-80" className="mt-20">
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
            {sakerPromise && klagerPromise && (
                <Suspense fallback={null}>
                    <HydrationBoundary state={dehydrate(klageQueryClient)}>
                        <Saker sakerPromise={sakerPromise} />
                    </HydrationBoundary>
                </Suspense>
            )}
            <Suspense fallback={<OppgaverSkeleton />}>
                <HydrationBoundary state={dehydrate(oppgaverQueryClient)}>
                    <HydrationBoundary state={dehydrate(dokumentasjonkravQueryClient)}>
                        <Oppgaver vilkarPromise={vilkarPromise} />
                    </HydrationBoundary>
                </HydrationBoundary>
            </Suspense>
            <Filopplasting id={id} />
            <Suspense fallback={<DokumenterSkeleton />}>
                <HydrationBoundary state={dehydrate(vedleggQueryClient)}>
                    <Dokumenter />
                </HydrationBoundary>
            </Suspense>
            {forelopigSvarPromise && (
                <Suspense fallback={null}>
                    <ForelopigSvar forelopigSvarPromise={forelopigSvarPromise} />
                </Suspense>
            )}
            <Bleed marginInline="full" className="pt-20 pb-20" asChild>
                <Box background="neutral-soft" padding="space-24" className="flex-1">
                    <div className="max-w-2xl mx-auto">
                        <VStack gap="space-80">
                            <Oversikt id={id} />
                            <Suspense fallback={<SoknadenDinSkeleton />}>
                                <HydrationBoundary state={dehydrate(vedleggQueryClient)}>
                                    <SoknadenDin />
                                </HydrationBoundary>
                            </Suspense>
                        </VStack>
                    </div>
                </Box>
            </Bleed>
            <Snarveier hideSokButton={true}>
                <SoknadSnarveier />
            </Snarveier>
        </VStack>
    );
};
