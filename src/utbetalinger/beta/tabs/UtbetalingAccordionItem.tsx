import { Accordion, BodyShort } from "@navikt/ds-react";
import { FileTextIcon } from "@navikt/aksel-icons";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import cx from "classnames";

import { logAmplitudeEvent, logButtonOrLinkClick } from "../../../utils/amplitude";
import { formatCurrency, formatDato, getDayAndMonth } from "../../../utils/formatting";
import { UtbetalingMedId } from "../UtbetalingerPanelBeta";
import { hentTekstForUtbetalingsmetode, hentUtbetalingTittel } from "../../utbetalingerUtils";
import { ManedUtbetalingStatus } from "../../../generated/model";

import { isLessThanTwoWeeksAgo } from "./isLessThanTwoWeeksAgo";

const onOpenChange = (open: boolean) =>
    logAmplitudeEvent(open ? "accordion åpnet" : "accordion lukket", { tekst: "Utbetaling" });

const UtbetalingAccordionItem = ({
    utbetalingManed: {
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
    utbetalingManed: UtbetalingMedId;
}) => {
    const { t, i18n } = useTranslation("utbetalinger");
    const erStoppet = status === ManedUtbetalingStatus.STOPPET;
    const dato = utbetalingsdato ?? forfallsdato;
    const datoStreng = dato ? getDayAndMonth(dato, i18n.language) : t("ukjentDato");
    return (
        <>
            <Accordion.Item defaultOpen={isLessThanTwoWeeksAgo(utbetalingsdato)} onOpenChange={onOpenChange}>
                <Accordion.Header className="items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="flex flex-wrap gap-2 max-w-[80%]">
                            <BodyShort className="font-bold">
                                {hentUtbetalingTittel(tittel, t("default_utbetalinger_tittel"))}
                            </BodyShort>
                            <BodyShort>
                                {t(`utbetalingStatus.${status}` as const)} {erStoppet ? null : datoStreng}
                            </BodyShort>
                        </div>

                        <BodyShort className={cx("ml-auto", { "text-strikethrough text-text-subtle": erStoppet })}>
                            {!erStoppet && <span className="navds-sr-only">{t("opprinneligSum")}</span>}
                            {formatCurrency(belop, i18n.language)} kr
                        </BodyShort>
                    </div>
                </Accordion.Header>
                <Accordion.Content className="pt-2">
                    {fom && tom && (
                        <>
                            <BodyShort className="font-bold">{t("periode")}</BodyShort>
                            <BodyShort spacing>
                                {formatDato(fom, i18n.language)} - {formatDato(tom, i18n.language)}
                            </BodyShort>
                        </>
                    )}
                    <>
                        <BodyShort className="font-bold">{t("mottaker")}</BodyShort>
                        {annenMottaker ? (
                            <BodyShort className="capitalize" spacing>
                                {mottaker}
                            </BodyShort>
                        ) : (
                            <BodyShort spacing>
                                {`${t("tilDeg")} (${hentTekstForUtbetalingsmetode(
                                    utbetalingsmetode ?? "",
                                    i18n
                                )} ${kontonummer})
                                            `}
                            </BodyShort>
                        )}
                    </>

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
        </>
    );
};
export default UtbetalingAccordionItem;
