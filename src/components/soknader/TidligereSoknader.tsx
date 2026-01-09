import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { Soknad, sortInactive } from "@components/soknaderList/list/soknaderUtils";
import SoknaderList from "@components/soknaderList/list/SoknaderList";

interface Props {
    soknader: Soknad[];
}

const TidligereSoknader = async ({ soknader }: Props) => {
    const t = await getTranslations("TidligereSoknader");

    const sorted = sortInactive(soknader);

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
