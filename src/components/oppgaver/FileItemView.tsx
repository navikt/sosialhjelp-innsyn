import React, {useState} from "react";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import Lenke from "nav-frontend-lenker";
import TrashBin from "../ikoner/TrashBin";
import {Fil} from "../../redux/innsynsdata/innsynsdataReducer";
import {formatBytes} from "../../utils/formatting";
import VedleggModal from "./VedleggModal";
import {FormattedMessage} from "react-intl";
import {Flatknapp} from "nav-frontend-knapper";
import {Element} from "nav-frontend-typografi";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

const FileItemView: React.FC<{
    fil: Fil;
    onDelete: (event: any, fil: Fil) => void;
}> = ({fil, onDelete}) => {
    const storrelse: string = formatBytes(fil.file ? fil.file.size : 0);

    const [modalVises, setModalVises] = useState(false);

    const onVisVedlegg = (event: ClickEvent): void => {
        setModalVises(true);
        event.preventDefault();
    };

    return (
        <div className="vedlegg_liste_element" id={"app"}>
            <div className="innhold">
                <div className="filnavn_lenkeboks">
                    {fil.file && (
                        <VedleggModal file={fil.file} onRequestClose={() => setModalVises(false)} synlig={modalVises} />
                    )}

                    <PaperClipSlanted className="filikon" />
                    <Lenke
                        href="#"
                        className="filnavn lenke_uten_ramme"
                        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onVisVedlegg(event)}
                    >
                        {fil.filnavn}
                    </Lenke>
                    <span className="filstorrelse">({storrelse})</span>
                </div>
                <div className="fjern_lenkeboks">
                    <Flatknapp mini onClick={(event) => onDelete(event, fil)}>
                        <Element>
                            <FormattedMessage id="vedlegg.fjern" />
                        </Element>
                        <TrashBin className="klikkbar_soppelboette" />
                    </Flatknapp>
                </div>
            </div>
        </div>
    );
};

export default FileItemView;
