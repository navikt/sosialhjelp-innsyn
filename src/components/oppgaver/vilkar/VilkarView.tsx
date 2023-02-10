import React from "react";
import {Vilkar} from "../../../redux/innsynsdata/innsynsdataReducer";
import {BodyShort, Label} from "@navikt/ds-react";
import styles from "../oppgaver.module.css";

interface Props {
    vilkar: Vilkar[];
}

export const VilkarView: React.FC<Props> = ({vilkar}) => {
    return (
        <ul className={styles.oppgaver_liste}>
            {vilkar.map((element, index) => (
                <li className={styles.oppgaver_detaljer} key={element.vilkarReferanse}>
                    <Label as="p">{element.tittel}</Label>
                    {element.beskrivelse && <BodyShort>{element.beskrivelse}</BodyShort>}
                </li>
            ))}
        </ul>
    );
};
