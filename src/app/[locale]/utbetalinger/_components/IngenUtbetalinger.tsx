import { useTranslations } from "next-intl";
import { BodyShort, BoxNew, Heading, VStack } from "@navikt/ds-react";
import React from "react";

const IngenUtbetalinger = () => {
    const t = useTranslations("IngenKommendeUtbetalinger");

    return (
        <BoxNew background="accent-soft" padding="space-24">
            <VStack gap="2">
                <Heading size="xsmall" level="3">
                    {t("tittel")}
                </Heading>
                <BodyShort>{t("beskrivelse1")}</BodyShort>
                <BodyShort>{t("beskrivelse2")}</BodyShort>
            </VStack>
        </BoxNew>
    );
};

export default IngenUtbetalinger;
