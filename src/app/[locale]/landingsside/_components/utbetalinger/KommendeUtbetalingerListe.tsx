"use client";

import { Tag } from "@navikt/ds-react";
import { CalendarIcon } from "@navikt/aksel-icons";
import { useFormatter, useTranslations } from "next-intl";
import { LinkCardFooter } from "@navikt/ds-react/LinkCard";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { ManedUtbetaling } from "@generated/ssr/model";
import { ITEMS_LIMIT } from "@components/showmore/useShowMore";
import ExpandableList from "@components/showmore/ExpandableList";

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
                return (
                    <li ref={index === ITEMS_LIMIT ? firstExpandedItemRef : null} tabIndex={-1}>
                        <DigisosLinkCard
                            key={utbetaling.referanse}
                            href="/utbetalinger"
                            description={utbetaling.tittel}
                            footer={
                                utbetaling.forfallsdato && (
                                    <LinkCardFooter>
                                        <Tag
                                            variant="info-moderate"
                                            size="small"
                                            icon={<CalendarIcon aria-hidden={true} />}
                                        >
                                            {t("utbetales", { dato: new Date(utbetaling.forfallsdato) })}
                                        </Tag>
                                    </LinkCardFooter>
                                )
                            }
                        >
                            {t("beskrivelse", { amount })}
                        </DigisosLinkCard>
                    </li>
                );
            }}
        </ExpandableList>
    );
};

export default KommendeUtbetalingerListe;
