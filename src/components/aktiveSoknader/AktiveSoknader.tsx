import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { hentAlleSaker } from "../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";

import AktiveSoknaderList from "./list/AktiveSoknaderList";
import AktiveSoknaderListSkeleton from "./list/AktiveSoknaderListSkeleton";
import AktiveSoknaderEmptyState from "./AktiveSoknaderEmptyState";

const AktiveSoknader = async () => {
    const t = await getTranslations("AktiveSoknader");
    const alleSaker = await hentAlleSaker();

    if (alleSaker.status !== 200) {
        throw new Error("Fikk feil fra alleSaker: " + alleSaker.status);
    }

    if (alleSaker.data.length === 0) {
        return <AktiveSoknaderEmptyState />;
    }

    return (
        <VStack gap="2">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <Suspense fallback={<AktiveSoknaderListSkeleton count={alleSaker.data.length} />}>
                <AktiveSoknaderList saker={alleSaker.data} />
            </Suspense>
        </VStack>
    );
};

export default AktiveSoknader;
