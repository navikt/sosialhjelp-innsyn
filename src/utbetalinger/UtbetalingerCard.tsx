import { BodyShort, ExpansionCard, HStack, VStack } from "@navikt/ds-react";
import { Link } from "@navikt/ds-react/Link";
import React from "react";
import { useFormatter, useTranslations } from "next-intl";
import { ArrowRightIcon } from "@navikt/aksel-icons";

import { ManedUtbetaling } from "@generated/ssr/model";

interface Props {
    manedUtbetaling: ManedUtbetaling;
    id: number;
    count: number;
}
const cardBorder = (idx: number, count: number) => {
    if (count === 1) return "border-0 rounded-t-none rounded-b-lg";
    if (idx === 0) return "border-0 rounded-none";
    if (idx === count - 1) return "border-0 rounded-t-none rounded-b-lg";
    return "border-0 rounded-t-none rounded-b-lg";
};
export const UtbetalingerCard = ({ manedUtbetaling, id, count }: Props) => {
    const format = useFormatter();
    const t = useTranslations("utbetalinger");

    return (
        <ExpansionCard aria-label="Utbetalinger" data-color="info" className={cardBorder(id, count)}>
            <ExpansionCard.Header>
                <ExpansionCard.Title>
                    <HStack gap="2" align="center">
                        <BodyShort size="medium" weight="semibold">
                            {manedUtbetaling.tittel}
                        </BodyShort>
                        <HStack gap="2">
                            <BodyShort size="small">{t("utbetalingStatus." + manedUtbetaling.status)}</BodyShort>
                            <BodyShort size="small">
                                {manedUtbetaling.forfallsdato
                                    ? format.dateTime(new Date(manedUtbetaling.forfallsdato), {
                                          day: "numeric",
                                          month: "long",
                                      })
                                    : t("ukjentDato")}
                            </BodyShort>
                        </HStack>
                        <BodyShort
                            size="small"
                            className="pointer-events-none absolute right-18 top-1/2 -translate-y-1/2"
                        >
                            {manedUtbetaling.belop} kr
                        </BodyShort>
                    </HStack>
                </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <VStack gap="4">
                    <VStack>
                        <BodyShort size="medium" weight="semibold">
                            Periode:
                        </BodyShort>
                        <BodyShort>
                            {manedUtbetaling.fom} - {manedUtbetaling.tom}
                        </BodyShort>
                    </VStack>
                    <VStack>
                        <BodyShort size="medium" weight="semibold">
                            Mottaker:
                        </BodyShort>
                        <BodyShort>{manedUtbetaling.mottaker}</BodyShort>
                    </VStack>
                    <HStack>
                        <Link href={`soknad/${manedUtbetaling.fiksDigisosId}`}>Se søknaden og vedtaket du fikk</Link>
                        <ArrowRightIcon fontSize="1.75rem" className="navds-link-anchor__arrow pointer-events-none" />
                    </HStack>
                </VStack>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
