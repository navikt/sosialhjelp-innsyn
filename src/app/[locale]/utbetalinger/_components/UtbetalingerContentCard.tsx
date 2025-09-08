import { BodyShort, ExpansionCard, HStack, VStack } from "@navikt/ds-react";
import NextLink from "next/link";
import { Link } from "@navikt/ds-react/Link";
import React from "react";
import { useFormatter, useTranslations } from "next-intl";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import cx from "classnames";

import { ManedUtbetaling } from "@generated/ssr/model";

import styles from "../../../../utbetalinger/utbetalinger.module.css";

interface Props {
    manedUtbetaling: ManedUtbetaling;
    id: number;
    count: number;
}
const cardBorder = (id: number, count: number) => {
    if (count <= 1) return "border-none rounded-t-none rounded-b-lg";
    if (id === count - 1) return "border-none rounded-t-none rounded-b-lg";
    return "border-none rounded-none";
};

export const UtbetalingerContentCard = ({ manedUtbetaling, id, count }: Props) => {
    const format = useFormatter();
    const t = useTranslations("UtbetalingerContentCard");

    //TODO:
    // ExpansionCard krever at det er et aria-label på komponenten
    // Finn et bedre aria-label enn "Utbetalinger" før alt blir prodsatt
    return (
        <ExpansionCard aria-label="Utbetalinger" data-color="accent" className={cardBorder(id, count)}>
            <ExpansionCard.Header className={cx(cardBorder(id, count), styles.headerNoUnderline)}>
                <ExpansionCard.Title>
                    <HStack align="center" className="w-full">
                        <HStack gap="2" align="center" className="min-w-0">
                            <BodyShort size="medium" weight="semibold" className="top-1/2 -translate-y-1/2">
                                {manedUtbetaling.tittel}
                            </BodyShort>
                            <BodyShort size="small" className="top-1/2 -translate-y-1/2">
                                {t(manedUtbetaling.status)}
                            </BodyShort>
                            <BodyShort size="small" className="top-1/2 -translate-y-1/2">
                                {manedUtbetaling.forfallsdato
                                    ? format.dateTime(new Date(manedUtbetaling.forfallsdato), {
                                          day: "numeric",
                                          month: "long",
                                      })
                                    : t("ukjentDato")}
                            </BodyShort>
                        </HStack>
                        <BodyShort weight="semibold" className="ml-auto">
                            {manedUtbetaling.belop} kr
                        </BodyShort>
                    </HStack>
                </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <VStack gap="4">
                    <VStack>
                        <BodyShort size="medium" weight="semibold">
                            {t("periode")}
                        </BodyShort>
                        <BodyShort>
                            {manedUtbetaling.fom && manedUtbetaling.tom
                                ? t.rich("datoRange", {
                                      fom: new Date(manedUtbetaling.fom),
                                      tom: new Date(manedUtbetaling.tom),
                                  })
                                : ""}
                        </BodyShort>
                    </VStack>
                    <VStack>
                        <BodyShort size="medium" weight="semibold">
                            {t("mottaker")}
                        </BodyShort>
                        <BodyShort>
                            {manedUtbetaling.kontonummer
                                ? t.rich("bankkonto", {
                                      norsk: (chunks) => <span lang="no">{chunks}</span>,
                                      konto: manedUtbetaling.kontonummer,
                                  })
                                : t("tilDeg")}
                        </BodyShort>
                    </VStack>
                    <Link as={NextLink} href={`soknad/${manedUtbetaling.fiksDigisosId}`}>
                        {t("lenke")}
                        <ArrowRightIcon fontSize="1.75rem" className="navds-link-anchor__arrow pointer-events-none" />
                    </Link>
                </VStack>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
