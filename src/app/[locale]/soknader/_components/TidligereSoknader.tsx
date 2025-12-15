import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import fetchSoknadsdetaljer from "@api/fetch/saksdetaljer/fetchSoknadsdetaljer";
import { ferdigbehandletAndOlderThan21Days, filterAndSort } from "@components/soknaderList/list/soknaderUtils";
import SoknaderList from "@components/soknaderList/list/SoknaderList";
import fetchAlleSoknader from "@api/fetch/alleSoknader/fetchAlleSoknader";

const TidligereSoknader = async () => {
    const t = await getTranslations("TidligereSoknader");

    const innsendteSoknader = await fetchAlleSoknader();

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
