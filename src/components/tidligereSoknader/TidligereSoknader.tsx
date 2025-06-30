import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { logger } from "@navikt/next-logger";

import { hentAlleSaker } from "../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import fetchSoknadsdetaljer from "../../api/fetch/saksdetaljer/fetchSoknadsdetaljer";
import { ferdigbehandletAndOlderThan21Days, filterAndSort } from "../soknaderList/list/soknaderUtils";
import SoknaderList from "../soknaderList/list/SoknaderList";

const fetchSaker = async () => {
    try {
        const alleSaker = await hentAlleSaker();
        return alleSaker;
    } catch (error: unknown) {
        logger.error(`Fikk feil under henting av alle saker. Error: ${error}`);
        return [];
    }
};

const TidligereSoknader = async () => {
    const t = await getTranslations("TidligereSoknader");

    const innsendteSoknader = await fetchSaker();

    const soknadsdetaljer = await Promise.all(fetchSoknadsdetaljer(innsendteSoknader));

    const sorted = filterAndSort(innsendteSoknader, soknadsdetaljer, ferdigbehandletAndOlderThan21Days);
    if (sorted.length === 0) {
        return null;
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

export default TidligereSoknader;
