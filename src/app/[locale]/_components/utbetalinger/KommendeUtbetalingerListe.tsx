"use client";

import ExpandableList from "@components/showmore/ExpandableList";
import { ITEMS_LIMIT } from "@components/showmore/useShowMore";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { ManedUtbetaling, ManedUtbetalingStatus } from "@generated/model";
import { CalendarIcon, ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import { Tag } from "@navikt/ds-react";
import { LinkCardFooter } from "@navikt/ds-react/LinkCard";
import { useFormatter, useTranslations } from "next-intl";

interface Props {
    alleKommende: ManedUtbetaling[];
    labelledById: string;
}

const KommendeUtbetalingerListe = ({ alleKommende, labelledById }: Props) => {
    const format = useFormatter();
    const t = useTranslations("KommendeUtbetalingerListe");

    return (
        <ExpandableList
            items={alleKommende}
            id="kommende-utbetalinger"
            showMoreSuffix={t("utbetalinger")}
            labelledById={labelledById}
        >
            {(utbetaling, index, firstExpandedItemRef) => {
                const amount = format.number(utbetaling.belop);
                const date = new Date(utbetaling.forfallsdato!);
                const stopped = utbetaling.status === ManedUtbetalingStatus.STOPPET;
                return (
                    <li
                        key={`${utbetaling.fiksDigisosId}-${utbetaling.utbetalingsdato}-${utbetaling.belop}`}
                        ref={index === ITEMS_LIMIT ? firstExpandedItemRef : null}
                        tabIndex={-1}
                    >
                        <DigisosLinkCard
                            href="/utbetalinger"
                            description={utbetaling.tittel}
                            footer={
                                utbetaling.forfallsdato && (
                                    <LinkCardFooter>
                                        {stopped ? (
                                            <Tag
                                                variant="warning-moderate"
                                                size="small"
                                                icon={<ExclamationmarkTriangleIcon aria-hidden={true} />}
                                            >
                                                {t("utbetalingStoppet")}
                                            </Tag>
                                        ) : (
                                            <Tag
                                                variant="info-moderate"
                                                size="small"
                                                icon={<CalendarIcon aria-hidden={true} />}
                                            >
                                                {t("utbetales", { date })}
                                            </Tag>
                                        )}
                                    </LinkCardFooter>
                                )
                            }
                        >
                            {stopped ? t("titleStoppet") : t("title", { amount })}
                            {!stopped && <span className="sr-only">{t("titleSrOnly", { date })}</span>}
                        </DigisosLinkCard>
                    </li>
                );
            }}
        </ExpandableList>
    );
};

export default KommendeUtbetalingerListe;
