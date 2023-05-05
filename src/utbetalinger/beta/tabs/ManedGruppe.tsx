import React from "react";
import {BodyShort} from "@navikt/ds-react";
import styles from "./manedgruppe.module.css";
import UtbetalingAccordion from "./UtbetalingAccordion";
import {UtbetalingerResponse} from "../UtbetalingerPanelBeta";

interface Props {
    utbetalingSak: UtbetalingerResponse;
}
const ManedGruppe = (props: Props) => {
    const {utbetalingSak} = props;

    return (
        <section className={styles.month_group}>
            <BodyShort className={`${styles.uthevetTekst} ${styles.capitalize} ${styles.monthYear_header}`}>
                <span>{utbetalingSak.maned + " " + utbetalingSak.ar}</span>
            </BodyShort>
            {utbetalingSak.utbetalingerForManed.map((utbetalingManed) => (
                <UtbetalingAccordion key={utbetalingManed.id} utbetalingManed={utbetalingManed} />
            ))}
        </section>
    );
};
export default ManedGruppe;
