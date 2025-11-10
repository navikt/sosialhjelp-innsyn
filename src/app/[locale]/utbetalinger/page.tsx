import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Heading, VStack } from "@navikt/ds-react";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getFlag, getToggles } from "@featuretoggles/unleash";
import { getQueryClient } from "@api/queryClient";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import { prefetchHentUtbetalingerQuery } from "@generated/ssr/utbetalinger-controller-2/utbetalinger-controller-2";

import Utbetalinger from "./_components/Utbetalinger";
import { UtbetalingerSkeleton } from "./_components/UtbetalingerSkeleton";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_utbetalinger_side", await getToggles());
    if (!toggle.enabled) {
        return notFound();
    }
    const t = await getTranslations("UtbetalingerPage");
    const queryClient = getQueryClient();

    prefetchHentUtbetalingerQuery(queryClient);

    return (
        <>
            <ClientBreadcrumbs dynamicBreadcrumbs={[{ title: t("breadcrumbTitle") }]} />
            <VStack gap={{ xs: "6", md: "20" }} className="mt-6 md:mt-20">
                <Heading size="xlarge" level="1">
                    {t("tittel")}
                </Heading>
                <Suspense fallback={<UtbetalingerSkeleton />}>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <Utbetalinger />
                    </HydrationBoundary>
                </Suspense>
            </VStack>
        </>
    );
};
export default Page;
