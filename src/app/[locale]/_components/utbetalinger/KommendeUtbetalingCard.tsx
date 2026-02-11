"use client";

import { ITEMS_LIMIT } from "@components/showmore/useShowMore";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { ManedUtbetaling, ManedUtbetalingStatus } from "@generated/model";
import { LinkCardFooter } from "@navikt/ds-react/LinkCard";
import { useFormatter, useTranslations } from "next-intl";
import UtbetalingStatusTag from "./UtbetalingStatusTag";

interface Props {
    utbetaling: ManedUtbetaling;
    index: number;
    firstExpandedItemRef: React.RefObject<HTMLLIElement | null> | null;
}

const KommendeUtbetalingCard = ({ utbetaling, index, firstExpandedItemRef }: Props) => {
    const format = useFormatter();
    const t = useTranslations("KommendeUtbetalingerListe");

    const stopped = utbetaling.status === ManedUtbetalingStatus.STOPPET;
    const date = new Date(utbetaling.forfallsdato!);
    const amount = format.number(utbetaling.belop);

    const title = stopped ? t("titleStoppet") : t("title", { amount });
    const srOnlyText = !stopped ? t("titleSrOnly", { date }) : null;

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
                            <UtbetalingStatusTag stopped={stopped} date={date} t={t} />
                        </LinkCardFooter>
                    )
                }
            >
                {title}
                {srOnlyText && <span className="sr-only">{srOnlyText}</span>}
            </DigisosLinkCard>
        </li>
    );
};

export default KommendeUtbetalingCard;
