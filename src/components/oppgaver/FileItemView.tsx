import React, {useState} from "react";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import Lenke from "nav-frontend-lenker";
import TrashBin from "../ikoner/TrashBin";
import {Fil} from "../../redux/innsynsdata/innsynsdataReducer";
import {formatBytes} from "../../utils/formatting";
import VedleggModal from "./VedleggModal";
import {FormattedMessage} from "react-intl";
import {REST_STATUS} from "../../utils/restUtils";
import {Flatknapp} from "nav-frontend-knapper";
import {Element} from "nav-frontend-typografi";
import {SkjemaelementFeilmelding} from "nav-frontend-skjema";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

const FileViewItem: React.FC<{
    fil: Fil;
    referanse: string;
    onDelete: (event: any, fil: Fil) => void;
}> = ({fil, referanse, onDelete}) => {
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
            {fil.status !== REST_STATUS.INITIALISERT &&
                fil.status !== REST_STATUS.PENDING &&
                fil.status !== REST_STATUS.OK && (
                    <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding_rad">
                        <FormattedMessage id={"vedlegg.opplasting_feilmelding_" + fil.status} />
                    </SkjemaelementFeilmelding>
                )}
        </div>
    );
};

export default FileViewItem;
