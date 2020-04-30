import LenkepanelBase from "nav-frontend-lenkepanel/lib/Lenkepanel-base";
import PaperClip from "../ikoner/PaperClip";
import Coins from "../ikoner/Coins";
import React from "react";
import {Utbetaling, Vedlegg} from "../../redux/innsynsdata/innsynsdataReducer";

interface Props {
    vedlegg: Vedlegg[];
    utbetalinger?: Utbetaling[];
}

const VedleggUtbetalingerLenker: React.FC<Props> = ({vedlegg, utbetalinger}) => {
    return (
        <div className="panel-luft-over panel-ikon-grupppe">
            <LenkepanelBase href="vedlegg" className="panel-ikon">
                <div className="panel-ikon-boks">
                    <PaperClip />
                </div>
                <span className="panel-ikon-tekst">Vedlegg ({vedlegg.length})</span>
            </LenkepanelBase>

            <LenkepanelBase href="#todo" className="panel-uthevet-ikon">
                <div className="panel-ikon-boks">
                    <Coins />
                </div>
                <span className="panel-ikon-tekst">Utbetalinger (0)</span>
            </LenkepanelBase>
        </div>
    );
};

export default VedleggUtbetalingerLenker;
