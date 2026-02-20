"use client";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { ManedUtbetaling, ManedUtbetalingStatus } from "@generated/model";
import { LinkCardFooter } from "@navikt/ds-react/LinkCard";
import { useFormatter, useTranslations } from "next-intl";
import UtbetalingStatusTag from "./UtbetalingStatusTag";

interface Props {
    utbetaling: ManedUtbetaling;
}

const KommendeUtbetalingCard = ({ utbetaling }: Props) => {
    const format = useFormatter();
    const t = useTranslations("KommendeUtbetalingerListe");

    const stopped = utbetaling.status === ManedUtbetalingStatus.STOPPET;
    const date = new Date(utbetaling.forfallsdato!);
    const amount = format.number(utbetaling.belop);

    const title = stopped ? t("titleStoppet") : t("title", { amount });
    const srOnlyText = !stopped ? t("titleSrOnly", { date }) : null;

    return (
        <DigisosLinkCard
            href="/utbetalinger"
            description={utbetaling.tittel}
            footer={
                utbetaling.forfallsdato && (
                    <LinkCardFooter>
                        <UtbetalingStatusTag stopped={stopped} date={date} />
                    </LinkCardFooter>
                )
            }
        >
            {title}
            {srOnlyText && <span className="sr-only">{srOnlyText}</span>}
        </DigisosLinkCard>
    );
};

export default KommendeUtbetalingCard;
