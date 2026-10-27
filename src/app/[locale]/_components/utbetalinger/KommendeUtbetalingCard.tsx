"use client";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { LinkCardFooter } from "@navikt/ds-react/LinkCard";
import { useFormatter, useTranslations } from "next-intl";
import UtbetalingStatusTag from "./UtbetalingStatusTag";
import { UtbetalingDto, UtbetalingDtoStatus } from "@generated/model";
import { hentReferanseDato } from "../../utbetalinger/_utils/utbetalinger-utils";

interface Props {
    utbetaling: UtbetalingDto;
}

const KommendeUtbetalingCard = ({ utbetaling }: Props) => {
    const format = useFormatter();
    const t = useTranslations("KommendeUtbetalingerListe");

    const stopped = utbetaling.status === UtbetalingDtoStatus.STOPPET;
    const date = hentReferanseDato(utbetaling);
    const amount = format.number(utbetaling.belop);

    const title = stopped ? t("titleStoppet") : t("title", { amount });
    const srOnlyText = !stopped && date ? t("titleSrOnly", { date }) : null;

    return (
        <DigisosLinkCard
            href="/utbetalinger"
            description={utbetaling.tittel}
            footer={
                date && (
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
