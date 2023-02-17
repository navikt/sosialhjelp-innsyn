import React from "react";
import {Vilkar} from "../../../redux/innsynsdata/innsynsdataReducer";
import {BodyShort, Label} from "@navikt/ds-react";
import styles from "./vilkar.module.css";

interface Props {
    vilkar: Vilkar[];
}

export const VilkarView: React.FC<Props> = ({vilkar}) => {
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
