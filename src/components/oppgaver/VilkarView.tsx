import React from "react";
import {Vilkar} from "../../redux/innsynsdata/innsynsdataReducer";
import {BodyShort, Label} from "@navikt/ds-react";

interface Props {
    vilkar: Vilkar;
}

export const VilkarView: React.FC<Props> = ({vilkar}) => {
    return (
        <div className={"oppgaver_detaljer luft_over_1rem"}>
            <div className={"oppgave-detalj-overste-linje"}>
                <div className={"tekst-wrapping"}>
                    <Label>{vilkar.tittel}</Label>
                </div>
                {vilkar.beskrivelse && (
                    <div className={"tekst-wrapping"}>
                        <BodyShort>{vilkar.beskrivelse}</BodyShort>
                    </div>
                )}
            </div>
        </div>
    );
};
