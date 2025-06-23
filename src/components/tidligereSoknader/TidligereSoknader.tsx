import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { hentAlleSaker } from "../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import fetchSoknadsdetaljer from "../../api/fetch/saksdetaljer/fetchSoknadsdetaljer";
import { ferdigbehandletAndOlderThan21Days, filterAndSort } from "../soknaderList/list/soknaderUtils";
import SoknaderList from "../soknaderList/list/SoknaderList";

const TidligereSoknader = async () => {
    const t = await getTranslations("TidligereSoknader");
    const innsendteSoknaderResponse = await hentAlleSaker();

    const innsendteSoknader = innsendteSoknaderResponse.status === 200 ? innsendteSoknaderResponse.data : [];

    const soknadsdetaljerResponses = await Promise.all(fetchSoknadsdetaljer(innsendteSoknader));
    const soknadsdetaljer = soknadsdetaljerResponses
        .filter((response) => response.status === 200)
        .map((response) => response.data);

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
