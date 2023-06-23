import {Accordion, BodyShort} from "@navikt/ds-react";
import styles from "./manedgruppe.module.css";
import {logAmplitudeEvent} from "../../../utils/amplitude";
import {formatCurrency, formatDato, getDayAndMonth} from "../../../utils/formatting";
import {Link} from "react-router-dom";
import {FileContent} from "@navikt/ds-icons";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import i18next from "../../../locales/i18n";
import {UtbetalingMedId} from "../UtbetalingerPanelBeta";
import {hentUtbetalingTittel} from "../../utbetalingerUtils";

function statusToTekst(status: string) {
    switch (status) {
        case "STOPPET":
            return i18next.t("utbetalinger:stoppet") + " ";
        case "PLANLAGT_UTBETALING":
            return i18next.t("utbetalinger:planlagt") + " ";
        case "UTBETALT":
            return i18next.t("utbetalinger:utbetalt") + " ";
        default:
            return status.toLowerCase() + " ";
    }
}
interface Props {
    utbetalingManed: UtbetalingMedId;
}

const UtbetalingAccordionItem = ({utbetalingManed}: Props) => {
    const {t} = useTranslation("utbetalinger");
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Accordion.Item open={isOpen}>
                <Accordion.Header
                    className={styles.accordion_header}
                    onClick={(e) => {
                        logAmplitudeEvent(isOpen ? "accordion lukket" : "accordion åpnet", {
                            tekst: "Utbetaling",
                        });
                        setIsOpen((isOpen) => !isOpen);
                    }}
                >
                    <div className={styles.accordion_headerContent}>
                        <div className={styles.float_left}>
                            <BodyShort className={styles.uthevetTekst}>
                                {hentUtbetalingTittel(utbetalingManed.tittel)}
                            </BodyShort>
                            <BodyShort>
                                {utbetalingManed.status === "STOPPET" ? (
                                    <>{i18next.t("utbetalinger:stoppet")}</>
                                ) : (
                                    <>
                                        {statusToTekst(utbetalingManed.status)}
                                        {utbetalingManed.utbetalingsdato
                                            ? getDayAndMonth(utbetalingManed.utbetalingsdato)
                                            : t("ukjentDato")}
                                    </>
                                )}
                            </BodyShort>
                        </div>

                        <BodyShort className={styles.float_right}>
                            {utbetalingManed.status === "STOPPET" ? (
                                <s>
                                    <span className="navds-sr-only">Opprinnelig sum: </span>
                                    {formatCurrency(utbetalingManed.belop)} kr
                                </s>
                            ) : (
                                <>{formatCurrency(utbetalingManed.belop)} kr</>
                            )}
                        </BodyShort>
                    </div>
                </Accordion.Header>
                <Accordion.Content className={styles.accordion_content}>
                    {utbetalingManed.fom && utbetalingManed.tom && (
                        <>
                            <BodyShort className={styles.uthevetTekst}>{t("periode")}</BodyShort>
                            <BodyShort spacing>
                                {formatDato(utbetalingManed.fom)} - {formatDato(utbetalingManed.tom)}
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
                                {`${t("tilDeg")} (${utbetalingManed.utbetalingsmetode ?? ""} ${
                                    utbetalingManed.kontonummer
                                })
                                            `}
                            </BodyShort>
                        )}
                    </>

                    <Link
                        to={"/" + utbetalingManed.fiksDigisosId + "/status"}
                        className={`navds-link ${styles.soknadLenke} `}
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
