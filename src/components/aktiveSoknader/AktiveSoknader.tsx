import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import * as R from "remeda";
import { logger } from "@navikt/next-logger";

import { hentAlleSaker } from "@generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import fetchPaabegynteSaker from "@api/fetch/paabegynteSoknader/fetchPaabegynteSoknader";
import fetchSoknadsdetaljer from "@api/fetch/saksdetaljer/fetchSoknadsdetaljer";
import { ferdigbehandletAndOlderThan21Days, filterAndSort } from "@components/soknaderList/list/soknaderUtils";
import SoknaderList from "@components/soknaderList/list/SoknaderList";

import AktiveSoknaderEmptyState from "./AktiveSoknaderEmptyState";

const fetchSaker = async () => {
    try {
        return hentAlleSaker();
    } catch (e: unknown) {
        logger.error(`Fikk feil under henting av alle saker. Feil: ${e}`);
        return [];
    }
};

const AktiveSoknader = async () => {
    const t = await getTranslations("AktiveSoknader");
    const [innsendteSoknader, paabegynteSaker] = await Promise.all([fetchSaker(), fetchPaabegynteSaker()]);

    const soknadsdetaljer = await Promise.all(fetchSoknadsdetaljer(innsendteSoknader));

    const sorted = filterAndSort(
        innsendteSoknader,
        soknadsdetaljer,
        R.isNot(ferdigbehandletAndOlderThan21Days),
        paabegynteSaker
    );

    if (sorted.length === 0) {
        return <AktiveSoknaderEmptyState />;
    }

    return (
        <VStack gap="2">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <SoknaderList soknader={sorted} />
        </VStack>
    );
};

export default AktiveSoknader;
