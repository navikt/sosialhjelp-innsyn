import React from "react";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import Lenke from "nav-frontend-lenker";
import TrashBin from "../ikoner/TrashBin";
import {Fil, InnsynsdataActionTypeKeys, Oppgave} from "../../redux/innsynsdata/innsynsdataReducer";
import {formatBytes} from "../../utils/formatting";
import {useDispatch} from "react-redux";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

const FilView: React.FC<{ fil: Fil, oppgave: Oppgave }> = ({fil, oppgave}) => {
    const file = fil.file;
    const storrelse: string = formatBytes(file.size);
    const dispatch = useDispatch();

    const onSlettClick = (event: ClickEvent): void => {
        dispatch({
            type: InnsynsdataActionTypeKeys.FJERN_FIL_FOR_OPPLASTING,
            oppgave: oppgave,
            fil: file
        });
        event.preventDefault();
    };

    return (
        <div className="vedlegg_liste">
            <span className="filnavn_lenkeboks">
                <PaperClipSlanted className="filikon"/>
                <Lenke href="123" className="filnavn lenke_uten_ramme">{file.name}</Lenke>
                <span className="filstorrelse">({storrelse})</span>
                {/*<span className="filstorrelse"> '{fil.status}'</span>*/}
            </span>
            <span className="fjern_lenkeboks">
                <Lenke
                    href="#"
                    className="fjern_lenke lenke_uten_ramme"
                    onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onSlettClick(event)}
                >
                    Fjern
                </Lenke>
                <button
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
