import React, {useState} from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import {Checkbox} from "nav-frontend-skjema";
import Lenke from "nav-frontend-lenker";
import UploadFileIcon from "../ikoner/UploadFile";
import {Fil, InnsynsdataActionTypeKeys, Oppgave, Vedlegg} from "../../redux/innsynsdata/innsynsdataReducer";
import VedleggActionsView from "./VedleggActionsView";
import FilView from "./FilView";
import {useDispatch} from "react-redux";
import {OriginalSoknadVedleggType} from "../../redux/soknadsdata/vedleggTypes";
import {originalSoknadVedleggTekstVisning} from "../../redux/soknadsdata/vedleggskravVisningConfig";

interface Props {
    oppgave: Oppgave;
    id: any;
}

export const legalFileExtension = (filename: string): boolean => {
    const fileExtension = filename.replace(/^.*\./, '');
    return fileExtension.match(/jpe?g|png|pdf/i) !== null;
};

type ChangeEvent = React.FormEvent<HTMLInputElement>;

const OppgaveView: React.FC<Props> = ({oppgave, id}) => {

    const dispatch = useDispatch();
    const [antallUlovligeFiler, setAntallUlovligeFiler] = useState(0);

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
            let ulovligeFilerCount = 0;
            for (var index = 0; index < files.length; index++) {
                const file: File = files[index];
                const filename = file.name;
                if (legalFileExtension(filename)) {
                    dispatch({
                        type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING,
                        oppgave: oppgave,
                        fil: {
                            filnavn: file.name,
                            status: "INITIALISERT",
                            file: file
                        }
                    });
                } else {
                    ulovligeFilerCount += 1;
                }
            }
            setAntallUlovligeFiler(ulovligeFilerCount);
        }
        event.preventDefault();
    };

    let typeTekst;
    let tilleggsinfoTekst;
    let sammensattType = oppgave.dokumenttype + "|" + oppgave.tilleggsinformasjon;
    let erOriginalSoknadVedleggType = Object.values(OriginalSoknadVedleggType).some(val => val === sammensattType);
    if (erOriginalSoknadVedleggType) {
        let soknadVedleggSpec = originalSoknadVedleggTekstVisning.find(spc => spc.type === sammensattType)!!;
        typeTekst = soknadVedleggSpec.tittel;
        tilleggsinfoTekst = soknadVedleggSpec.tilleggsinfo;
    } else {
        typeTekst = oppgave.dokumenttype;
        tilleggsinfoTekst = oppgave.tilleggsinformasjon;
    }

    return (
        <>
            <div className={"oppgaver_detalj " + (antallUlovligeFiler > 0 ? " oppgaver_detalj_feil" : "")}>
                <Element>{typeTekst}</Element>
                {tilleggsinfoTekst && (
                    <Normaltekst className="luft_over_4px">
                        {tilleggsinfoTekst}
                    </Normaltekst>)}

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
                    <FilView key={index} fil={fil} oppgave={oppgave}/>
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
                        <Element>Velg fil</Element>
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

            {antallUlovligeFiler > 0 && (
                <div className="oppgaver_vedlegg_feilmelding">
                    En eller flere filer ble ikke lagt til. Du kan bare laste opp filer av typen JPG, PNG, PDF.
                </div>
            )}

        </>
    )
};

export default OppgaveView;
