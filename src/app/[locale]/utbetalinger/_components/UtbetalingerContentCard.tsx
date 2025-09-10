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
    const alignmentWithChevron = "leading-[1.75]"; // Justerer linjehøyde for å matche høyden på chevron i ExpansionCard
    //TODO:
    // ExpansionCard krever at det er et aria-label på komponenten
    // Finn et bedre aria-label enn "Utbetalinger" før alt blir prodsatt
    return (
        <ExpansionCard
            size="small"
            aria-label={"Utvidbart utbetalingsinformasjon om " + manedUtbetaling.tittel}
            data-color="accent"
            className={cardBorder(id, count)}
        >
            <ExpansionCard.Header
                className={cx("gap-0 data-[open=true]:after:content-none", cardBorder(id, count), styles.headerFill)}
            >
                <ExpansionCard.Title>
                    <HStack align="center" wrap={false} className="w-full justify" justify="space-between">
                        <HStack gap="2" align="center" className="min-w-0" wrap={false}>
                            <BodyShort size="medium" weight="semibold" className={cx("truncate", alignmentWithChevron)}>
                                {manedUtbetaling.tittel}
                            </BodyShort>
                            <BodyShort size="small" className={cx("truncate", alignmentWithChevron)}>
                                {t(manedUtbetaling.status)}
                            </BodyShort>
                            <BodyShort size="small" className={cx("truncate", alignmentWithChevron)}>
                                {manedUtbetaling.forfallsdato
                                    ? format.dateTime(new Date(manedUtbetaling.forfallsdato), {
                                          day: "numeric",
                                          month: "long",
                                      })
                                    : t("ukjentDato")}
                            </BodyShort>
                        </HStack>
                        <BodyShort weight="semibold" className={cx("truncate", alignmentWithChevron)}>
                            {manedUtbetaling.belop} kr
                        </BodyShort>
                    </HStack>
                </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <VStack gap="4">
                    <VStack>
                        <BodyShort>{t("periode")}</BodyShort>
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
