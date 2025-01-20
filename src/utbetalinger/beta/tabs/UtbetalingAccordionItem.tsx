import { Accordion, BodyShort } from "@navikt/ds-react";
import { FileTextIcon } from "@navikt/aksel-icons";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { logger } from "@navikt/next-logger";
import cx from "classnames";

import { logAmplitudeEvent, logButtonOrLinkClick } from "../../../utils/amplitude";
import { formatCurrency, formatDato, getDayAndMonth } from "../../../utils/formatting";
import { UtbetalingMedId } from "../UtbetalingerPanelBeta";
import { hentTekstForUtbetalingsmetode, hentUtbetalingTittel } from "../../utbetalingerUtils";
import { ManedUtbetalingStatus } from "../../../generated/model";

import styles from "./manedgruppe.module.css";
import { isLessThanTwoWeeksAgo } from "./isLessThanTwoWeeksAgo";
const onOpenChange = (open: boolean) =>
    logAmplitudeEvent(open ? "accordion åpnet" : "accordion lukket", { tekst: "Utbetaling" });
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

    return (
        <>
            <Accordion.Item defaultOpen={isLessThanTwoWeeksAgo(utbetalingsdato)} onOpenChange={onOpenChange}>
                <Accordion.Header className="items-center">
                    <div className={styles.accordion_headerContent}>
                        <div className={styles.float_left}>
                            <BodyShort className={styles.uthevetTekst}>
                                {hentUtbetalingTittel(tittel, t("default_utbetalinger_tittel"))}
                            </BodyShort>
                            <BodyShort>
                                {erStoppet ? (
                                    <>{t("utbetalinger:stoppet")}</>
                                ) : (
                                    <>
                                        {statusToTekst(t, status)}
                                        {utbetalingsdato
                                            ? getDayAndMonth(utbetalingsdato, i18n.language)
                                            : forfallsdato
                                              ? getDayAndMonth(forfallsdato, i18n.language)
                                              : t("ukjentDato")}
                                    </>
                                )}
                            </BodyShort>
                        </div>

                        <BodyShort className={cx("ml-auto", { "text-strikethrough text-text-subtle": erStoppet })}>
                            {!erStoppet && <span className="navds-sr-only">{t("opprinneligSum")}</span>}
                            {formatCurrency(belop, i18n.language)} kr
                        </BodyShort>
                    </div>
                </Accordion.Header>
                <Accordion.Content className={styles.accordion_content}>
                    {fom && tom && (
                        <>
                            <BodyShort className={styles.uthevetTekst}>{t("periode")}</BodyShort>
                            <BodyShort spacing>
                                {formatDato(fom, i18n.language)} - {formatDato(tom, i18n.language)}
                            </BodyShort>
                        </>
                    )}
                    <>
                        <BodyShort className={styles.uthevetTekst}>{t("mottaker")}</BodyShort>
                        {annenMottaker ? (
                            <BodyShort className={styles.capitalize} spacing>
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
                        href={"/" + fiksDigisosId + "/status"}
                        className={`navds-link ${styles.soknadLenke} `}
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
