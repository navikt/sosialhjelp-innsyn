import { BodyShort, ExpansionCard, HStack, VStack } from "@navikt/ds-react";
import { Link } from "@navikt/ds-react/Link";
import React from "react";
import { useFormatter, useTranslations } from "next-intl";

import { ManedUtbetaling, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

interface Props {
    utbetalinger: NyeOgTidligereUtbetalingerResponse;
    manedUtbetaling: ManedUtbetaling;
    id: number;
}

export const UtbetalingerCard = ({ utbetalinger, manedUtbetaling, id }: Props) => {
    const format = useFormatter();
    const t = useTranslations("utbetalinger");

    return (
        <ExpansionCard
            key={id}
            aria-label="Utbetalinger"
            data-color="info"
            className={
                utbetalinger.utbetalingerForManed.length === 1
                    ? "border-0 rounded-t-none rounded-b-lg"
                    : id === 0
                      ? "border-0 rounded-none"
                      : id === utbetalinger.utbetalingerForManed.length - 1
                        ? "border-0 rounded-t-none rounded-b-lg"
                        : "border-0 rounded-t-none rounded-b-lg"
            }
        >
            <ExpansionCard.Header>
                <ExpansionCard.Title>
                    <HStack gap="4" align="center">
                        <BodyShort size="medium" weight="semibold">
                            {manedUtbetaling.tittel}
                        </BodyShort>
                        <HStack gap="1">
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
                <VStack gap="3">
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
                    <Link href={`soknad/${manedUtbetaling.fiksDigisosId}`}>Se søknaden og vedtaket du fikk</Link>
                </VStack>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
