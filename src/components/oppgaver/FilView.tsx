import React from "react";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import Lenke from "nav-frontend-lenker";
import TrashBin from "../ikoner/TrashBin";
import {InnsynsdataActionTypeKeys, Oppgave} from "../../redux/innsynsdata/innsynsdataReducer";
import {formatBytes} from "../../utils/formatting";
import {useDispatch} from "react-redux";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

const FilView: React.FC<{ fil: File, oppgave: Oppgave }> = ({fil, oppgave}) => {
    const storrelse: string = formatBytes(fil.size);
    const dispatch = useDispatch();

    const onSlettClick = (event: ClickEvent): void => {
        dispatch({
            type: InnsynsdataActionTypeKeys.FJERN_FIL_FOR_OPPLASTING,
            oppgave: oppgave,
            fil: fil
        });
        event.preventDefault();
    };

    return (
        <div className="vedlegg_liste">
            <span className="filnavn_lenkeboks">
                <PaperClipSlanted className="filikon"/>
                <Lenke href="123" className="filnavn lenke_uten_ramme">{fil.name}</Lenke>
                <span className="filstorrelse">({storrelse})</span>
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
