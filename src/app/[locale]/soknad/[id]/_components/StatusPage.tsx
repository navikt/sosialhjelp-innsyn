import React, { PropsWithChildren, ReactNode, Suspense } from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { prefetchHentVedleggQuery } from "@generated/ssr/vedlegg-controller/vedlegg-controller";
import { getQueryClient } from "@api/queryClient";
import { prefetchGetOppgaverBetaQuery } from "@generated/ssr/oppgave-controller/oppgave-controller";

import Oversikt from "./oversikt/Oversikt";
import Dokumenter, { DokumenterSkeleton } from "./dokumenter/Dokumenter";
import Filopplasting from "./dokumenter/Filopplasting";
import Oppgaver from "./oppgaver/Oppgaver";
import OppgaveAlert from "./oppgaver/OppgaveAlert";

interface Props {
    heading: ReactNode;
    alert?: ReactNode;
    id: string;
}

export const StatusPage = async ({ id, heading, alert, children }: PropsWithChildren<Props>) => {
    const vedleggQueryClient = getQueryClient();
    const oppgaverQueryClient = getQueryClient();

    // Prefetcher her og putter det i HydrationBoundary slik at det er tilgjengelig i browseren
    prefetchHentVedleggQuery(vedleggQueryClient, id);
    await prefetchGetOppgaverBetaQuery(oppgaverQueryClient, id);
    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1">
                {heading}
            </Heading>
            {alert}
            <HydrationBoundary state={dehydrate(oppgaverQueryClient)}>
                <OppgaveAlert />
                <Oppgaver />
            </HydrationBoundary>
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
