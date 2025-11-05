import { BodyShort, ExpansionCard, HStack, VStack } from "@navikt/ds-react";
import { Link } from "@navikt/ds-react/Link";
import React from "react";
import { useFormatter, useTranslations } from "next-intl";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import cx from "classnames";

import { Link as NextLink } from "@i18n/navigation";
import { ManedUtbetaling } from "@generated/ssr/model";
import { useFlag } from "@featuretoggles/context";

import styles from "../../../../../utbetalinger/utbetalinger.module.css";

import { Utbetalingsmetode } from "./Utbetalingsmetode";

interface Props {
    manedUtbetaling: ManedUtbetaling;
    index: number;
    count: number;
}
export const cardBorder = (id: number, count: number) => {
    if (count <= 1) return "border-none rounded-t-none rounded-b-lg";
    if (id === count - 1) return "border-none rounded-t-none rounded-b-lg";
    return "border-none rounded-none";
};

export const UtbetalingerContentCard = ({ manedUtbetaling, index, count }: Props) => {
    const format = useFormatter();
    const toggle = useFlag("sosialhjelp.innsyn.ny_soknadside"); // lenken til søknadensiden byttes basert på denne flaggen, kan bli fjernet når ny søknadsside er lansert

    const t = useTranslations("UtbetalingerContentCard");

    return (
        <ExpansionCard
            size="small"
            aria-label={t("arialabel") + manedUtbetaling.tittel}
            data-color="accent"
            className={cx("hover:outline-none hover:shadow-none", cardBorder(index, count), styles.headerFill)}
        >
            <ExpansionCard.Header
                className={cx(
                    "gap-2 data-[open=true]:after:content-none",
                    cardBorder(index, count),
                    styles.headerFill,
                    styles.chevronTight
                )}
            >
                <ExpansionCard.Title as="h4">
                    <HStack align="center" wrap={false} className="w-full min-w-0" justify="space-between">
                        <HStack gap="2" align="center" className={cx("min-w-0", styles.titleClamp)} wrap={false}>
                            <VStack gap="2" className="min-w-0">
                                <BodyShort
                                    lang="no"
                                    size="medium"
                                    weight="semibold"
                                    className={cx(styles.truncateWhenClosed)}
                                >
                                    {manedUtbetaling.tittel}
                                </BodyShort>
                                <HStack gap="1">
                                    <BodyShort size="small">{t(manedUtbetaling.status)}</BodyShort>
                                    <BodyShort size="small">
                                        {manedUtbetaling.utbetalingsdato
                                            ? format.dateTime(new Date(manedUtbetaling.utbetalingsdato), {
                                                  day: "numeric",
                                                  month: "long",
                                              })
                                            : manedUtbetaling.forfallsdato
                                              ? format.dateTime(new Date(manedUtbetaling.forfallsdato), {
                                                    day: "numeric",
                                                    month: "long",
                                                })
                                              : t("ukjentDato")}
                                    </BodyShort>
                                </HStack>
                            </VStack>
                        </HStack>
                        <BodyShort
                            weight="semibold"
                            className="tabular-nums whitespace-nowrap shrink-0 self-center leading-none"
                        >
                            {format.number(manedUtbetaling.belop)} kr
                        </BodyShort>
                    </HStack>
                </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content data-color="neutral">
                <VStack gap="4">
                    {manedUtbetaling.fom && manedUtbetaling.tom && (
                        <VStack>
                            <BodyShort size="medium" weight="semibold">
                                {t("periode")}
                            </BodyShort>
                            <BodyShort>
                                {t.rich("datoRange", {
                                    fom: new Date(manedUtbetaling.fom),
                                    tom: new Date(manedUtbetaling.tom),
                                })}
                            </BodyShort>
                        </VStack>
                    )}
                    <VStack>
                        <BodyShort size="medium" weight="semibold">
                            {t("utbetalingsmetode")}
                        </BodyShort>
                        <BodyShort>
                            <Utbetalingsmetode utbetaling={manedUtbetaling} />
                        </BodyShort>
                    </VStack>
                    <Link
                        as={NextLink}
                        href={
                            toggle.enabled
                                ? `/soknad/${manedUtbetaling.fiksDigisosId}`
                                : `/${manedUtbetaling.fiksDigisosId}/status`
                        }
                    >
                        <BodyShort>{t("lenke")}</BodyShort>
                        <ArrowRightIcon fontSize="1.75rem" className="navds-link-anchor__arrow pointer-events-none" />
                    </Link>
                </VStack>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
