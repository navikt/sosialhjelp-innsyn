import React from "react";
import {Accordion, BodyShort} from "@navikt/ds-react";
import {formatCurrency, formatDato, getDayAndMonth} from "../../../utils/formatting";
import {ManedUtbetaling, NyeOgTidligereUtbetalingerResponse} from "../../../generated/model";
import styles from "./manedgruppe.module.css";
import {Link} from "react-router-dom";
import {FileContent} from "@navikt/ds-icons";
import {useTranslation} from "react-i18next";
import i18next from "../../../locales/i18n";

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
    utbetalingSak: NyeOgTidligereUtbetalingerResponse;
}
const ManedGruppe = (props: Props) => {
    const {utbetalingSak} = props;
    const {t} = useTranslation("utbetalinger");

    return (
        <section className={styles.month_group}>
            <BodyShort className={`${styles.uthevetTekst} ${styles.capitalize} ${styles.monthYear_header}`}>
                <span>{utbetalingSak.maned + " " + utbetalingSak.ar}</span>
            </BodyShort>
            {utbetalingSak.utbetalingerForManed.map((utbetalingMaaned: ManedUtbetaling, index: number) => {
                const annenMottaker: boolean = utbetalingMaaned.annenMottaker;
                return (
                    <Accordion key={utbetalingMaaned.forfallsdato + "_" + index}>
                        <Accordion.Item>
                            <Accordion.Header className={styles.accordion_header}>
                                <div className={styles.accordion_headerContent}>
                                    <div className={styles.float_left}>
                                        <BodyShort className={styles.uthevetTekst}>
                                            {utbetalingMaaned.tittel ? utbetalingMaaned.tittel : t("utbetaling")}
                                        </BodyShort>
                                        <BodyShort>
                                            {statusToTekst(utbetalingMaaned.status)}
                                            {utbetalingMaaned.utbetalingsdato
                                                ? getDayAndMonth(utbetalingMaaned.utbetalingsdato)
                                                : t("ukjentDato")}
                                        </BodyShort>
                                    </div>

                                    {utbetalingMaaned.status !== "STOPPET" && (
                                        <BodyShort className={styles.float_right}>
                                            {formatCurrency(utbetalingMaaned.belop)} kr
                                        </BodyShort>
                                    )}
                                </div>
                            </Accordion.Header>
                            <Accordion.Content className={styles.accordion_content}>
                                {utbetalingMaaned.fom && utbetalingMaaned.tom && (
                                    <>
                                        <BodyShort className={styles.uthevetTekst}>{t("periode")}</BodyShort>
                                        <BodyShort spacing>
                                            {formatDato(utbetalingMaaned.fom)} - {formatDato(utbetalingMaaned.tom)}
                                        </BodyShort>
                                    </>
                                )}
                                <>
                                    <BodyShort className={styles.uthevetTekst}>{t("mottaker")}</BodyShort>
                                    {annenMottaker ? (
                                        <BodyShort className={styles.capitalize} spacing>
                                            {utbetalingMaaned.mottaker}
                                        </BodyShort>
                                    ) : (
                                        <BodyShort spacing>
                                            {`${t("tilDeg")} (${utbetalingMaaned.utbetalingsmetode ?? ""} ${
                                                utbetalingMaaned.kontonummer
                                            })
                                            `}
                                        </BodyShort>
                                    )}
                                </>

                                <Link
                                    to={"/" + utbetalingMaaned.fiksDigisosId + "/status"}
                                    className={`navds-link ${styles.soknadLenke} `}
                                >
                                    <FileContent aria-hidden width="1.5rem" height="1.5rem" />
                                    {t("soknadLenke")}
                                </Link>
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                );
            })}
        </section>
    );
};
export default ManedGruppe;
