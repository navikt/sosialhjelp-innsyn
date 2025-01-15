import React from "react";
import { BodyShort, Label } from "@navikt/ds-react";

import { VilkarResponse } from "../../../generated/model";

import styles from "./vilkar.module.css";

interface Props {
    vilkar: VilkarResponse[];
}

export const VilkarView = ({ vilkar }: Props) => {
    return (
        <ul className={styles.vilkar_liste}>
            {vilkar.map((element) => (
                <li className={styles.vilkar_detaljer} key={element.vilkarReferanse}>
                    <Label as="p">{element.tittel}</Label>
                    {element.beskrivelse && <BodyShort>{element.beskrivelse}</BodyShort>}
                </li>
            ))}
        </ul>
    );
};
