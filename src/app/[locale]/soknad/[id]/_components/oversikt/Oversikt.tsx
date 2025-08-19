import { Heading, VStack } from "@navikt/ds-react";
import React, { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { prefetchHentHendelserBetaQuery } from "@generated/ssr/hendelse-controller/hendelse-controller";
import { getQueryClient } from "@api/queryClient";

import Steps, { StepsSkeleton } from "./steps/Steps";

interface Props {
    id: string;
}

const Oversikt = async ({ id }: Props) => {
    const t = await getTranslations("Oversikt");
    const queryClient = getQueryClient();
    prefetchHentHendelserBetaQuery(queryClient, id);
    return (
        <VStack gap="2">
            <Heading size="large" level="2">
                {t("tittel")}
            </Heading>
            <Suspense fallback={<StepsSkeleton />}>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Steps />
                </HydrationBoundary>
            </Suspense>
        </VStack>
    );
};

export default Oversikt;
