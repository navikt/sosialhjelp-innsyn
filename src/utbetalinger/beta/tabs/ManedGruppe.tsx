import React from "react";
import {Accordion, BodyShort} from "@navikt/ds-react";
import styles from "./manedgruppe.module.css";
import UtbetalingAccordionItem from "./UtbetalingAccordionItem";
import {UtbetalingerResponse} from "../UtbetalingerPanelBeta";
import {hentMaanedString} from "../../utbetalingerUtils";

interface Props {
    utbetalingSak: UtbetalingerResponse;
}
const ManedGruppe = (props: Props) => {
    const {utbetalingSak} = props;

    return (
        <section className={styles.month_group}>
            <BodyShort className={`${styles.uthevetTekst} ${styles.capitalize} ${styles.monthYear_header}`}>
                <span>{hentMaanedString(utbetalingSak.maned) + " " + utbetalingSak.ar}</span>
            </BodyShort>
            <Accordion>
                {utbetalingSak.utbetalingerForManed.map((utbetalingManed) => (
                    <UtbetalingAccordionItem key={utbetalingManed.id} utbetalingManed={utbetalingManed} />
                ))}
            </Accordion>
        </section>
    );
};
export default ManedGruppe;
