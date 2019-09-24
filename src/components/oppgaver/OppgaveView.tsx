import React from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import {Checkbox} from "nav-frontend-skjema";
import Lenke from "nav-frontend-lenker";
import UploadFileIcon from "../ikoner/UploadFile";
import {Fil, InnsynsdataActionTypeKeys, Oppgave, Vedlegg} from "../../redux/innsynsdata/innsynsdataReducer";
import VedleggActionsView from "./VedleggActionsView";
import FilView from "./FilView";
import {useDispatch} from "react-redux";

interface Props {
    oppgave: Oppgave;
    id: any;
}

type ClickEvent = React.MouseEvent<any>;
type ChangeEvent = React.FormEvent<HTMLInputElement>;

const OppgaveView: React.FC<Props> = ({oppgave, id}) => {

    const dispatch = useDispatch();

    const onLinkClicked = (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
        const uploadElement: any = document.getElementById('file_' + id);
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    const onChange = (event: ChangeEvent) => {
        const files: FileList | null = event.currentTarget.files;
        if (files) {
            for (var index = 0; index < files.length; index++) {
                dispatch({
                    type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING,
                    oppgave: oppgave,
                    fil: {
                        filnavn: files[index].name,
                        status: "",
                        file: files[index]
                    }
                })
            }
        }
        event.preventDefault();
    };

    return (
        <div className="oppgaver_detalj">
            <Element>{oppgave.dokumenttype}</Element>
            <Normaltekst className="luft_over_4px">
                {oppgave.tilleggsinformasjon}
            </Normaltekst>

            {!oppgave.vedlegg && (
                <Checkbox label={'Dette har jeg levert'} className="luft_over_1rem"/>
            )}

            {oppgave.vedlegg && oppgave.vedlegg.length === 0 && (
                <Checkbox label={'Dette har jeg levert'} className="luft_over_1rem"/>
            )}
            {oppgave.vedlegg && oppgave.vedlegg.length > 0 && oppgave.vedlegg.map((vedlegg: Vedlegg, index: number) =>
                <VedleggActionsView vedlegg={vedlegg} key={index}/>
            )}

            {oppgave.filer && oppgave.filer.length > 0 && oppgave.filer.map((fil: Fil, index: number) =>
                <FilView key={index} fil={fil.file} oppgave={oppgave}/>
            )}

            <div className="oppgaver_last_opp_fil">
                <UploadFileIcon
                    className="last_opp_fil_ikon"
                    onClick={(event: any) => {onLinkClicked(event)}}
                />
                <Lenke
                    href="#todo"
                    className="lenke_uten_ramme"
                    onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {onLinkClicked(event)}}
                >
                    <Element>Last opp vedlegg</Element>
                </Lenke>
                <input
                    type="file"
                    id={'file_' + id}
                    multiple={true}
                    onChange={(event: ChangeEvent) => onChange(event)}
                    style={{display: "none"}}
                />
            </div>

        </div>
    )
};

export default OppgaveView;
