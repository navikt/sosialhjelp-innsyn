import { useTranslations } from "next-intl";
import { BodyShort, BoxNew, Heading, VStack } from "@navikt/ds-react";
import React from "react";

const IngenUtbetalingerPeriode = () => {
    const t = useTranslations("IngenPeriodeUtbetalinger");

    return (
        <BoxNew background="accent-soft" padding="space-24">
            <VStack gap="4">
                <Heading size="xsmall" level="3">
                    {t("tittel")}
                </Heading>
                <BodyShort>{t("beskrivelse")}</BodyShort>
            </VStack>
        </BoxNew>
    );
};

export default IngenUtbetalingerPeriode;
