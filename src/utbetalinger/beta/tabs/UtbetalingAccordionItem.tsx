import { Accordion, BodyShort } from "@navikt/ds-react";
import { FileContent } from "@navikt/ds-icons";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";

import { logAmplitudeEvent, logButtonOrLinkClick } from "../../../utils/amplitude";
import { formatCurrency, formatDato, getDayAndMonth } from "../../../utils/formatting";
import { UtbetalingMedId } from "../UtbetalingerPanelBeta";
import { hentTekstForUtbetalingsmetode, hentUtbetalingTittel } from "../../utbetalingerUtils";

import styles from "./manedgruppe.module.css";
import {logger} from "@navikt/next-logger";

function statusToTekst(t: (key: string) => string, status?: string) {
    switch (status) {
        case "STOPPET":
            return t("utbetalinger:stoppet") + " ";
        case "PLANLAGT_UTBETALING":
            return t("utbetalinger:planlagt") + " ";
        case "UTBETALT":
            return t("utbetalinger:utbetalt") + " ";
        default:
            if (!status?.toLowerCase) {
                logger.error("Status is not a string in statusToTekst? Status: " + status);
            }
            return status?.toLowerCase?.() + " " ?? "Ingen status";
    }
}
interface Props {
    utbetalingManed: UtbetalingMedId;
}

export const utbetalingsdetaljerDefaultAapnet = (dagensDato: Date, utbetalingsdato?: string) => {
    if (utbetalingsdato == "") return false;
    const utbetalingsDato: Date = new Date(utbetalingsdato ?? "");

    const femtenDagerSiden: Date = new Date(dagensDato.getTime() - 15 * 24 * 60 * 60 * 1000);
    femtenDagerSiden.setHours(0, 0, 0, 0);

    const femtenDagerTil: Date = new Date(dagensDato.getTime() + 15 * 24 * 60 * 60 * 1000);
    femtenDagerTil.setHours(1, 0, 0, 0);

    const erUtbetalingsdatoInnenDeSisteFemtenDagene =
        utbetalingsDato >= femtenDagerSiden && utbetalingsDato <= dagensDato;

    const erUtbetalingsdatoInnenDeNesteFemtenDagene =
        utbetalingsDato <= femtenDagerTil && utbetalingsDato >= dagensDato;

    return erUtbetalingsdatoInnenDeSisteFemtenDagene || erUtbetalingsdatoInnenDeNesteFemtenDagene;
};

const UtbetalingAccordionItem = ({ utbetalingManed }: Props) => {
    const { t, i18n } = useTranslation("utbetalinger");
    const [isOpen, setIsOpen] = useState(utbetalingsdetaljerDefaultAapnet(new Date(), utbetalingManed.utbetalingsdato));

    return (
        <>
            <Accordion.Item open={isOpen}>
                <Accordion.Header
                    className={styles.accordion_header}
                    onClick={() => {
                        logAmplitudeEvent(isOpen ? "accordion lukket" : "accordion åpnet", {
                            tekst: "Utbetaling",
                        });
                        setIsOpen((isOpen) => !isOpen);
                    }}
                >
                    <div className={styles.accordion_headerContent}>
                        <div className={styles.float_left}>
                            <BodyShort className={styles.uthevetTekst}>
                                {hentUtbetalingTittel(utbetalingManed.tittel, t("default_utbetalinger_tittel"))}
                            </BodyShort>
                            <BodyShort>
                                {utbetalingManed.status === "STOPPET" ? (
                                    <>{t("utbetalinger:stoppet")}</>
                                ) : (
                                    <>
                                        {statusToTekst(t, utbetalingManed.status)}
                                        {utbetalingManed.utbetalingsdato
                                            ? getDayAndMonth(utbetalingManed.utbetalingsdato, i18n.language)
                                            : utbetalingManed.forfallsdato
                                              ? getDayAndMonth(utbetalingManed.forfallsdato, i18n.language)
                                              : t("ukjentDato")}
                                    </>
                                )}
                            </BodyShort>
                        </div>

                        <BodyShort className={styles.float_right}>
                            {utbetalingManed.status === "STOPPET" ? (
                                <s>
                                    <span className="navds-sr-only">{t("opprinneligSum")}</span>
                                    {formatCurrency(utbetalingManed.belop, i18n.language)} kr
                                </s>
                            ) : (
                                <>{formatCurrency(utbetalingManed.belop, i18n.language)} kr</>
                            )}
                        </BodyShort>
                    </div>
                </Accordion.Header>
                <Accordion.Content className={styles.accordion_content}>
                    {utbetalingManed.fom && utbetalingManed.tom && (
                        <>
                            <BodyShort className={styles.uthevetTekst}>{t("periode")}</BodyShort>
                            <BodyShort spacing>
                                {formatDato(utbetalingManed.fom, i18n.language)} -{" "}
                                {formatDato(utbetalingManed.tom, i18n.language)}
                            </BodyShort>
                        </>
                    )}
                    <>
                        <BodyShort className={styles.uthevetTekst}>{t("mottaker")}</BodyShort>
                        {utbetalingManed.annenMottaker ? (
                            <BodyShort className={styles.capitalize} spacing>
                                {utbetalingManed.mottaker}
                            </BodyShort>
                        ) : (
                            <BodyShort spacing>
                                {`${t("tilDeg")} (${hentTekstForUtbetalingsmetode(
                                    utbetalingManed.utbetalingsmetode ?? "",
                                    i18n
                                )} ${utbetalingManed.kontonummer})
                                            `}
                            </BodyShort>
                        )}
                    </>

                    <Link
                        href={"/" + utbetalingManed.fiksDigisosId + "/status"}
                        className={`navds-link ${styles.soknadLenke} `}
                        onClick={() => logButtonOrLinkClick("Åpner søknaden fra utbetalingen")}
                    >
                        <FileContent aria-hidden width="1.5rem" height="1.5rem" />
                        {t("soknadLenke")}
                    </Link>
                </Accordion.Content>
            </Accordion.Item>
        </>
    );
};
export default UtbetalingAccordionItem;
