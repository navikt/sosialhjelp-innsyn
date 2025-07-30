import { PropsWithChildren, ReactNode } from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import {
    getHentHendelserBetaQueryKey,
    prefetchHentHendelserBetaQuery,
} from "../../generated/ssr/hendelse-controller/hendelse-controller";
import {
    getHentVedleggQueryKey,
    prefetchHentVedleggQuery,
} from "../../generated/ssr/vedlegg-controller/vedlegg-controller";

import Oversikt from "./oversikt/Oversikt";
import Dokumenter from "./dokumenter/Dokumenter";
import Filopplasting from "./dokumenter/Filopplasting";

interface Props {
    heading: ReactNode;
    alert?: ReactNode;
    id: string;
}

export const StatusPage = async ({ id, heading, alert, children }: PropsWithChildren<Props>) => {
    const queryClient = new QueryClient();

    // Prefetcher her og putter det i HydrationBoundary slik at det er tilgjengelig i browseren
    await Promise.all([prefetchHentHendelserBetaQuery(queryClient, id), prefetchHentVedleggQuery(queryClient, id)]);

    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1">
                {heading}
            </Heading>
            {alert}
            {children}
            <HydrationBoundary
                state={dehydrate(queryClient, {
                    shouldDehydrateQuery: ({ queryKey }) => queryKey === getHentHendelserBetaQueryKey(id),
                })}
            >
                <Oversikt />
            </HydrationBoundary>
            <Filopplasting />
            <HydrationBoundary
                state={dehydrate(queryClient, {
                    shouldDehydrateQuery: ({ queryKey }) => queryKey === getHentVedleggQueryKey(id),
                })}
            >
                <Dokumenter />
            </HydrationBoundary>
        </VStack>
    );
};
