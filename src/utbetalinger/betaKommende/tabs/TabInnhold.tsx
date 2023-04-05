import React from "react";
import {Accordion, BodyShort} from "@navikt/ds-react";
import {formatCurrency, formatDato, getDayAndMonth} from "../../../utils/formatting";
import {ManedUtbetaling, KommendeOgUtbetalteUtbetalingerResponse} from "../../../generated/model";
import styles from "./tabs.module.css";
import {Link} from "react-router-dom";
import {FileContent} from "@navikt/ds-icons";
import {ExclamationmarkIcon} from "@navikt/aksel-icons";

interface Props {
    utbetalingSak: KommendeOgUtbetalteUtbetalingerResponse;
}
const TabInnhold = (props: Props) => {
    const {utbetalingSak} = props;

    return (
        <section className={styles.month_group}>
            <BodyShort className={`${styles.uthevetTekst} ${styles.capitalize} ${styles.monthYear_header}`}>
                <span>{utbetalingSak.maned + " " + utbetalingSak.ar}</span>
            </BodyShort>
            {utbetalingSak.utbetalinger.map((utbetalingMaaned: ManedUtbetaling, index: number) => {
                const annenMottaker: boolean = utbetalingMaaned.annenMottaker;
                return (
                    <div key={utbetalingMaaned.forfallsdato + "_" + index}>
                        <Accordion>
                            <Accordion.Item>
                                <Accordion.Header className={styles.accordion_header}>
                                    <div className={styles.accordion_headerContent}>
                                        {utbetalingMaaned.status === "STOPPET" && (
                                            <ExclamationmarkIcon title="obs!" className={styles.stoppetIkon} />
                                        )}
                                        <BodyShort className={styles.uthevetTekst}>
                                            {utbetalingMaaned.tittel ? utbetalingMaaned.tittel : "Utbetaling"}
                                        </BodyShort>
                                        <BodyShort>
                                            {utbetalingMaaned.utbetalingsdato
                                                ? getDayAndMonth(utbetalingMaaned.utbetalingsdato)
                                                : "Ukjent utbetalingsdato"}
                                        </BodyShort>
                                        <BodyShort>
                                            {utbetalingMaaned.status === "STOPPET" ? (
                                                <>
                                                    <span className={styles.stoppetTekst}>Stoppet</span>
                                                    <del>{formatCurrency(utbetalingMaaned.belop)} kr</del>
                                                </>
                                            ) : (
                                                <>{formatCurrency(utbetalingMaaned.belop)} kr</>
                                            )}
                                        </BodyShort>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Content>
                                    {utbetalingMaaned.fom && utbetalingMaaned.tom && (
                                        <>
                                            <BodyShort className={styles.uthevetTekst}>Periode</BodyShort>
                                            <BodyShort spacing>
                                                {formatDato(utbetalingMaaned.fom)} - {formatDato(utbetalingMaaned.tom)}
                                            </BodyShort>
                                        </>
                                    )}
                                    <>
                                        <BodyShort className={styles.uthevetTekst}>Mottaker</BodyShort>
                                        {annenMottaker ? (
                                            <BodyShort className={styles.capitalize} spacing>
                                                {utbetalingMaaned.mottaker}
                                            </BodyShort>
                                        ) : (
                                            <BodyShort spacing>
                                                Til deg (
                                                {utbetalingMaaned.utbetalingsmetode && (
                                                    <>{utbetalingMaaned.utbetalingsmetode} </>
                                                )}
                                                {utbetalingMaaned.kontonummer})
                                            </BodyShort>
                                        )}
                                    </>

                                    <Link
                                        to={"/" + utbetalingMaaned.fiksDigisosId + "/status"}
                                        className={`navds-link ${styles.soknadLenke} `}
                                    >
                                        <FileContent aria-hidden width="1.5rem" height="1.5rem" />
                                        Gå til søknaden og les vedtaket for mer detaljer
                                    </Link>
                                </Accordion.Content>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                );
            })}
        </section>
    );
};
export default TabInnhold;
