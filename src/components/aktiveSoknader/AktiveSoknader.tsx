import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import fetchPaabegynteSaker from "@api/fetch/paabegynteSoknader/fetchPaabegynteSoknader";
import fetchSoknadsdetaljer from "@api/fetch/saksdetaljer/fetchSoknadsdetaljer";
import { filterAndSort, isActiveSoknad } from "@components/soknaderList/list/soknaderUtils";
import SoknaderList from "@components/soknaderList/list/SoknaderList";
import fetchAlleSoknader from "@api/fetch/alleSoknader/fetchAlleSoknader";

import AktiveSoknaderEmptyState from "./AktiveSoknaderEmptyState";

const AktiveSoknader = async () => {
    const t = await getTranslations("AktiveSoknader");

    const [innsendteSoknader, paabegynteSaker] = await Promise.all([fetchAlleSoknader(), fetchPaabegynteSaker()]);
    const soknadsdetaljer = await Promise.all(fetchSoknadsdetaljer(innsendteSoknader));
    const sorted = filterAndSort(innsendteSoknader, soknadsdetaljer, isActiveSoknad, paabegynteSaker);

    const soknadCount = innsendteSoknader.length + paabegynteSaker.length;

    if (soknadCount === 0) {
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
