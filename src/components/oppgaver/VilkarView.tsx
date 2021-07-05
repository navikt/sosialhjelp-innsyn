import React from "react";
import {VilkarElement} from "../../redux/innsynsdata/innsynsdataReducer";

interface Props {
    vilkar: VilkarElement;
}

export const VilkarView: React.FC<Props> = ({vilkar}) => {
    return (
        <div>
            <div className={"oppgaver_detaljer luft_over_1rem"}>{vilkar.tittel}</div>
        </div>
    );
};
