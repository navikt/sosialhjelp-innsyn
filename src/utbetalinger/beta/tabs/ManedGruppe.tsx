import React from "react";
import {BodyShort} from "@navikt/ds-react";
import {ManedUtbetaling, NyeOgTidligereUtbetalingerResponse} from "../../../generated/model";
import styles from "./manedgruppe.module.css";
import i18next from "../../../locales/i18n";
import UtbetalingAccordion from "./UtbetalingAccordion";

interface Props {
    utbetalingSak: NyeOgTidligereUtbetalingerResponse;
}
const ManedGruppe = (props: Props) => {
    const {utbetalingSak} = props;

    return (
        <section className={styles.month_group}>
            <BodyShort className={`${styles.uthevetTekst} ${styles.capitalize} ${styles.monthYear_header}`}>
                <span>{utbetalingSak.maned + " " + utbetalingSak.ar}</span>
            </BodyShort>
            {utbetalingSak.utbetalingerForManed.map((utbetalingManed: ManedUtbetaling, index: number) => (
                <UtbetalingAccordion
                    key={JSON.stringify(utbetalingManed) + "_" + index}
                    utbetalingManed={utbetalingManed}
                />
            ))}
        </section>
    );
};
export default ManedGruppe;
