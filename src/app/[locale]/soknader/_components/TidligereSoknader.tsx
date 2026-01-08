import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import * as R from "remeda";
import fetchSoknadsdetaljer from "@api/fetch/saksdetaljer/fetchSoknadsdetaljer";
import { filterAndSort, isActiveSoknad } from "@components/soknaderList/list/soknaderUtils";
import SoknaderList from "@components/soknaderList/list/SoknaderList";
import fetchAlleSoknader from "@api/fetch/alleSoknader/fetchAlleSoknader";

const TidligereSoknader = async () => {
    const t = await getTranslations("TidligereSoknader");

    const innsendteSoknader = await fetchAlleSoknader();

    const soknadsdetaljer = await Promise.all(fetchSoknadsdetaljer(innsendteSoknader));

    const sorted = filterAndSort(innsendteSoknader, soknadsdetaljer, R.isNot(isActiveSoknad));
    if (sorted.length === 0) {
        return null;
    }
    const headingId = "tidligere-soknader-heading";

    return (
        <VStack gap="2">
            <Heading size="medium" level="2" id={headingId}>
                {t("tittel")}
            </Heading>
            <SoknaderList soknader={sorted} labelledById={headingId} />
        </VStack>
    );
};

export default TidligereSoknader;
