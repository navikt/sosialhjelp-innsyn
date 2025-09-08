import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Heading, VStack } from "@navikt/ds-react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getFlag, getToggles } from "@featuretoggles/unleash";
import {
    prefetchHentNyeUtbetalingerQuery,
    prefetchHentTidligereUtbetalingerQuery,
} from "@generated/ssr/utbetalinger-controller/utbetalinger-controller";
import { getQueryClient } from "@api/queryClient";

import Utbetalinger from "./_components/Utbetalinger";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_utbetalinger_side", await getToggles());
    const t = await getTranslations("UtbetalingerPage");
    if (!toggle.enabled) {
        return notFound();
    }

    const qc = getQueryClient();
    await Promise.all([prefetchHentNyeUtbetalingerQuery(qc), prefetchHentTidligereUtbetalingerQuery(qc)]);
    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1">
                {t("tittel")}
            </Heading>
            <HydrationBoundary state={dehydrate(qc)}>
                <Utbetalinger />
            </HydrationBoundary>
        </VStack>
    );
};
export default Page;
