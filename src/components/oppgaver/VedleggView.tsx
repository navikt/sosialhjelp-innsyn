import React from "react";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import Lenke from "nav-frontend-lenker";
import TrashBin from "../ikoner/TrashBin";
import {Vedlegg} from "../../redux/innsynsdata/innsynsdataReducer";

const VedleggView: React.FC<{ vedlegg: Vedlegg }> = ({vedlegg}) => {
    return (
        <div className="vedlegg_liste">
            <span className="filnavn_lenkeboks">
                <PaperClipSlanted className="filikon"/>
                <Lenke href="123" className="filnavn lenke_uten_ramme">{vedlegg.filnavn}</Lenke>
                <span className="filstorrelse">({vedlegg.filstorrelse})</span>
            </span>
            <span className="fjern_lenkeboks">
                <Lenke href="4335" className="fjern_lenke lenke_uten_ramme">Fjern</Lenke>
                <TrashBin className="klikkbar_soppelboette"/>
            </span>
        </div>
    );
};

export default VedleggView;
