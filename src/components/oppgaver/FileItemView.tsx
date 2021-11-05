import React, {useState} from "react";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import TrashBin from "../ikoner/TrashBin";
import {Fil} from "../../redux/innsynsdata/innsynsdataReducer";
import {formatBytes} from "../../utils/formatting";
import VedleggModal from "./VedleggModal";
import {FormattedMessage} from "react-intl";
import {Element} from "nav-frontend-typografi";
import {REST_STATUS} from "../../utils/restUtils";
import {SkjemaelementFeilmelding} from "nav-frontend-skjema";
import {Button, Link} from "@navikt/ds-react";

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
                    <Link
                        href="#"
                        className="filnavn"
                        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onVisVedlegg(event)}
                    >
                        {fil.filnavn}
                    </Link>
                    <span className="filstorrelse">({storrelse})</span>
                </div>
                <div className="fjern_lenkeboks">
                    <Button variant="tertiary" size="small" onClick={(event) => onDelete(event, fil)}>
                        <Element>
                            <FormattedMessage id="vedlegg.fjern" />
                        </Element>
                        <TrashBin className="klikkbar_soppelboette" />
                    </Button>
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

export default FileItemView;
