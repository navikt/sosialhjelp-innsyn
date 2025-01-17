import React from "react";
import { Accordion, BodyShort } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import { UtbetalingerResponseMedId } from "../UtbetalingerPanelBeta";
import { hentMaanedString } from "../../utbetalingerUtils";

import styles from "./manedgruppe.module.css";
import UtbetalingAccordionItem from "./UtbetalingAccordionItem";

interface Props {
    utbetalingSak: UtbetalingerResponseMedId;
}
export const ManedGruppe = (props: Props) => {
    const { utbetalingSak } = props;
    const { i18n } = useTranslation();

    return (
        <section className={styles.month_group}>
            <BodyShort className={`${styles.uthevetTekst} ${styles.capitalize} ${styles.monthYear_header}`}>
                <span>{hentMaanedString(utbetalingSak.maned, i18n) + " " + utbetalingSak.ar}</span>
            </BodyShort>
            <Accordion>
                {utbetalingSak.utbetalingerForManed.map((utbetalingManed) => (
                    <UtbetalingAccordionItem key={utbetalingManed.id} utbetalingManed={utbetalingManed} />
                ))}
            </Accordion>
        </section>
    );
};
