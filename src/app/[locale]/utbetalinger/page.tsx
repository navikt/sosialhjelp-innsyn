import { getTranslations } from "next-intl/server";
import { Heading, VStack } from "@navikt/ds-react";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { getQueryClient } from "@api/queryClient";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import { prefetchHentUtbetalingerQuery } from "@generated/ssr/utbetalinger-controller-2/utbetalinger-controller-2";

import Utbetalinger from "./_components/Utbetalinger";
import { UtbetalingerSkeleton } from "./_components/UtbetalingerSkeleton";
import Snarveier from "@components/snarveier/Snarveier";
import SoknaderSnarvei from "@components/snarveier/SoknaderSnarvei";
import LandingssideSnarvei from "@components/snarveier/LandingssideSnarvei";

const Page = async () => {
    const t = await getTranslations("UtbetalingerPage");
    const queryClient = getQueryClient();

    prefetchHentUtbetalingerQuery(queryClient);

    return (
        <>
            <ClientBreadcrumbs dynamicBreadcrumbs={[{ title: t("breadcrumbTitle") }]} />
            <VStack gap={{ xs: "6", md: "20" }} className="mt-6 ax-md:mt-20">
                <Heading size="xlarge" level="1">
                    {t("tittel")}
                </Heading>
                <Suspense fallback={<UtbetalingerSkeleton />}>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <Utbetalinger />
                    </HydrationBoundary>
                </Suspense>
                <Snarveier>
                    <SoknaderSnarvei />
                    <LandingssideSnarvei />
                </Snarveier>
            </VStack>
        </>
    );
};

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("UtbetalingerPage");
    return {
        title: t("tittel"),
    };
};

export default Page;
