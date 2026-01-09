import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import SoknaderList from "@components/soknaderList/list/SoknaderList";
import { Soknad, sortAktive } from "@components/soknaderList/list/soknaderUtils";

interface Props {
    soknader: Soknad[];
}

const AktiveSoknader = async ({ soknader }: Props) => {
    const t = await getTranslations("AktiveSoknader");

    const sorted = sortAktive(soknader);

    if (sorted.length === 0) {
        return null;
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
