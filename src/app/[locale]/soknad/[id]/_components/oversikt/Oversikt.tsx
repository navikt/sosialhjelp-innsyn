import { Heading, VStack } from "@navikt/ds-react";
import React, { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { prefetchHentHendelserBetaQuery } from "@generated/ssr/hendelse-controller/hendelse-controller";
import { getQueryClient } from "@api/queryClient";

import History, { StepsSkeleton } from "./history/events/History";

interface Props {
    id: string;
}

const Oversikt = async ({ id }: Props) => {
    const t = await getTranslations("Saksprosessen");
    const queryClient = getQueryClient();
    prefetchHentHendelserBetaQuery(queryClient, id);
    return (
        <VStack gap="4">
            <Heading size="medium" level="2" id="Saksprosessen">
                {t("tittel")}
            </Heading>
            <Suspense fallback={<StepsSkeleton />}>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <History labelledById="Saksprosessen" />
                </HydrationBoundary>
            </Suspense>
        </VStack>
    );
};

export default Oversikt;
