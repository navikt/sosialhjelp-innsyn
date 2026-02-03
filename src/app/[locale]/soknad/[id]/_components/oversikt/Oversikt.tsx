import { BodyLong, Heading, VStack } from "@navikt/ds-react";
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
    const t = await getTranslations("Saksprosessen");
    const queryClient = getQueryClient();
    prefetchHentHendelserBetaQuery(queryClient, id);
    return (
        <VStack gap="4">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <BodyLong>{t("beskrivelse")}</BodyLong>
            <Suspense fallback={<StepsSkeleton />}>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Steps />
                </HydrationBoundary>
            </Suspense>
        </VStack>
    );
};

export default Oversikt;
