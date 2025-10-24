import { BodyShort, BoxNew, Heading, VStack } from "@navikt/ds-react";
import React from "react";
import { useTranslations } from "next-intl";

import { Option } from "../Utbetalinger";

interface Props {
    selectedChip: Option;
}

const Description = ({ selectedChip }: Props) => {
    const t = useTranslations("IngenUtbetalinger.Description");
    if (selectedChip === "kommende") {
        return (
            <>
                <BodyShort>{t("kommende.beskrivelse")}</BodyShort>
                <BodyShort>{t("kommende.beskrivelse2")}</BodyShort>
            </>
        );
    }
    return <BodyShort>{t(`periode.beskrivelse`)}</BodyShort>;
};

const IngenUtbetalinger = ({ selectedChip }: Props) => {
    const t = useTranslations("IngenUtbetalinger");

    const tittelKeyPrefix = selectedChip === "kommende" ? "kommende" : "periode";
    return (
        <BoxNew background="accent-soft" padding="space-24">
            <VStack gap="2">
                <Heading size="xsmall" level="3">
                    {t(`${tittelKeyPrefix}.tittel`)}
                </Heading>
                <Description selectedChip={selectedChip} />
            </VStack>
        </BoxNew>
    );
};

export default IngenUtbetalinger;
