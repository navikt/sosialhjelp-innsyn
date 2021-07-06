import React from "react";
import {Vilkar} from "../../redux/innsynsdata/innsynsdataReducer";
import {Element, Normaltekst} from "nav-frontend-typografi";

interface Props {
    vilkar: Vilkar;
}

export const VilkarView: React.FC<Props> = ({vilkar}) => {
    return (
        <div className={"oppgaver_detaljer luft_over_1rem"}>
            <div className={"oppgave-detalj-overste-linje"}>
                <div className={"tekst-wrapping"}>
                    <Element>{vilkar.tittel}</Element>
                </div>
                {vilkar.beskrivelse && (
                    <div className={"tekst-wrapping"}>
                        <Normaltekst className="luft_over_4px">{vilkar.beskrivelse}</Normaltekst>
                    </div>
                )}
            </div>
        </div>
    );
};
