import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Heading, VStack } from "@navikt/ds-react";
import { Suspense } from "react";

import { getFlag, getToggles } from "@featuretoggles/unleash";

import Utbetalinger from "./_components/Utbetalinger";
import { UtbetalingerSkeleton } from "./_components/UtbetalingerSkeleton";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_utbetalinger_side", await getToggles());
    const t = await getTranslations("UtbetalingerPage");
    if (!toggle.enabled) {
        return notFound();
    }

    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1">
                {t("tittel")}
            </Heading>
            <Suspense fallback={<UtbetalingerSkeleton />}>
                <Utbetalinger />
            </Suspense>
        </VStack>
    );
};
export default Page;
