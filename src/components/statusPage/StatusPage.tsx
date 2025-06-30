import { PropsWithChildren, ReactNode } from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { prefetchHentHendelserBetaQuery } from "../../generated/ssr/hendelse-controller/hendelse-controller";

import Oversikt from "./oversikt/Oversikt";
import Dokumenter from "./dokumenter/Dokumenter";

interface Props {
    heading: ReactNode;
    alert?: ReactNode;
    id: string;
}

export const StatusPage = async ({ id, heading, alert, children }: PropsWithChildren<Props>) => {
    const queryClient = new QueryClient();

    // Prefetcher her og putter det i HydrationBoundary slik at det er tilgjengelig i browseren
    await prefetchHentHendelserBetaQuery(queryClient, id);
    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1">
                {heading}
            </Heading>
            {alert}
            {children}
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Oversikt />
            </HydrationBoundary>
            <Dokumenter id={id}/>
        </VStack>
    );
};
