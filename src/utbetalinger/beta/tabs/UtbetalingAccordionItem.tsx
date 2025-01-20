import { Accordion, BodyShort } from "@navikt/ds-react";
import { FileTextIcon } from "@navikt/aksel-icons";
import { useTranslation } from "next-i18next";
import Link from "next/link";

import { logAmplitudeEvent, logButtonOrLinkClick } from "../../../utils/amplitude";
import { formatDato } from "../../../utils/formatting";
import { utbetalingsmetodeText } from "../../utbetalingerUtils";
import { type ManedUtbetaling } from "../../../generated/model";

import { isLessThanTwoWeeksAgo } from "./isLessThanTwoWeeksAgo";
import { UtbetalingAccordionHeader } from "./UtbetalingAccordionHeader";

const onOpenChange = (open: boolean) =>
    logAmplitudeEvent(open ? "accordion åpnet" : "accordion lukket", { tekst: "Utbetaling" });

const UtbetalingAccordionItem = ({
    utbetaling: {
        annenMottaker,
        belop,
        fiksDigisosId,
        fom,
        forfallsdato,
        kontonummer,
        mottaker,
        status,
        tittel,
        tom,
        utbetalingsdato,
        utbetalingsmetode,
    },
}: {
    utbetaling: ManedUtbetaling;
}) => {
    const { t, i18n } = useTranslation("utbetalinger");
    const dato = utbetalingsdato ?? forfallsdato;

    return (
        <Accordion.Item defaultOpen={isLessThanTwoWeeksAgo(utbetalingsdato)} onOpenChange={onOpenChange}>
            <UtbetalingAccordionHeader dato={dato} tittel={tittel} belop={belop} status={status} />
            <Accordion.Content className="pt-2">
                {fom && tom && (
                    <>
                        <BodyShort className="font-bold">{t("periode")}</BodyShort>
                        <BodyShort spacing>
                            {formatDato(fom, i18n.language)} - {formatDato(tom, i18n.language)}
                        </BodyShort>
                    </>
                )}
                <BodyShort className="font-bold">{t("mottaker")}</BodyShort>
                {annenMottaker ? (
                    <BodyShort className="capitalize" spacing>
                        {mottaker}
                    </BodyShort>
                ) : (
                    <BodyShort spacing>
                        {t("tilDeg")} {utbetalingsmetodeText(utbetalingsmetode, i18n)} {kontonummer}
                    </BodyShort>
                )}

                <Link
                    href={`/${fiksDigisosId}/status`}
                    className="navds-link items-center gap-2 flex"
                    onClick={() => logButtonOrLinkClick("Åpner søknaden fra utbetalingen")}
                >
                    <FileTextIcon aria-hidden width="1.5rem" height="1.5rem" />
                    {t("soknadLenke")}
                </Link>
            </Accordion.Content>
        </Accordion.Item>
    );
};
export default UtbetalingAccordionItem;
