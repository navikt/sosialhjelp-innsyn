import React, {useState} from "react";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import Lenke from "nav-frontend-lenker";
import TrashBin from "../ikoner/TrashBin";
import {Fil, InnsynsdataActionTypeKeys, Oppgave} from "../../redux/innsynsdata/innsynsdataReducer";
import {formatBytes} from "../../utils/formatting";
import {useDispatch} from "react-redux";
import VedleggModal from "./VedleggModal";
import {FormattedMessage} from "react-intl";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

const FilView: React.FC<{ index: number, fil: Fil, oppgave?: Oppgave }> = ({index, fil, oppgave}) => {
    const storrelse: string = formatBytes(fil.file ? fil.file.size : 0);
    const dispatch = useDispatch();

    const onSlettClick = (event: ClickEvent): void => {
        dispatch({
            type: oppgave
                ? InnsynsdataActionTypeKeys.FJERN_FIL_FOR_OPPLASTING
                : InnsynsdataActionTypeKeys.FJERN_FIL_FOR_ETTERSENDELSE,
            oppgave: oppgave,
            index: index
        });
        event.preventDefault();
    };

    const [modalVises, setModalVises] = useState(false);

    const onVisVedlegg = (event: ClickEvent): void => {
        setModalVises(true);
        event.preventDefault();
    };

    return (
        <div className="vedlegg_liste_element" id={"app"}>
            <span className="filnavn_lenkeboks">
                { fil.file &&
                    <VedleggModal
                        file={fil.file}
                        onRequestClose={() => setModalVises(false)}
                        synlig={modalVises}
                    />

                }

                <PaperClipSlanted className="filikon"/>
                <Lenke
                    href="#"
                    className="filnavn lenke_uten_ramme"
                    onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onVisVedlegg(event)}
                >
                    {fil.filnavn}
                </Lenke>
                <span className="filstorrelse">({storrelse})</span>
            </span>
            <span className="fjern_lenkeboks">
                <Lenke
                    href="#"
                    id={"fil_" + fil.filnavn + "_fjern_lenke_knapp"}
                    className="fjern_lenke lenke_uten_ramme"
                    onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onSlettClick(event)}
                >
                    <FormattedMessage id="vedlegg.fjern"/>
                </Lenke>
                <button
                    id={"fil_" + fil.filnavn + "_fjern_symbol_knapp"}
                    className="lenke"
                    style={{borderStyle: "none"}}
                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onSlettClick(event)}
                >
                    <TrashBin className="klikkbar_soppelboette"/>
                </button>
            </span>
        </div>
    );
};

export default FilView;
