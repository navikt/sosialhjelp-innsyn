import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import * as R from "remeda";
import fetchPaabegynteSaker from "@api/fetch/paabegynteSoknader/fetchPaabegynteSoknader";
import fetchSoknadsdetaljer from "@api/fetch/saksdetaljer/fetchSoknadsdetaljer";
import { ferdigbehandletAndOlderThan21Days, filterAndSort } from "@components/soknaderList/list/soknaderUtils";
import SoknaderList from "@components/soknaderList/list/SoknaderList";
import fetchAlleSoknader from "@api/fetch/alleSoknader/fetchAlleSoknader";

import AktiveSoknaderEmptyState from "./AktiveSoknaderEmptyState";

const AktiveSoknader = async () => {
    const t = await getTranslations("AktiveSoknader");

    const [innsendteSoknader, paabegynteSaker] = await Promise.all([fetchAlleSoknader(), fetchPaabegynteSaker()]);
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

    const headingId = "aktive-soknader-heading";
    return (
        <VStack gap="2">
            <Heading size="medium" level="2" id={headingId}>
                {t("tittel")}
            </Heading>
            <SoknaderList soknader={sorted} labelledById={headingId} />
        </VStack>
    );
};

export default AktiveSoknader;
