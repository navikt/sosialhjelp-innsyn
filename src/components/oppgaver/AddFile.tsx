import {
    DokumentasjonEtterspurtElement,
    InnsynsdataActionTypeKeys,
    KommuneResponse,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {FilFeil, finnFilerMedFeil} from "../../utils/vedleggUtils";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {erOpplastingAvVedleggTillat} from "../driftsmelding/DriftsmeldingUtilities";
import {
    setFileAttachmentsUploadFailed,
    setFileUploadFailed,
    setFileUploadFailedInBackend,
    setFileUploadFailedVirusCheckInBackend,
} from "../../redux/innsynsdata/innsynsDataActions";
import {logInfoMessage} from "../../redux/innsynsdata/loggActions";
import {Element, Normaltekst} from "nav-frontend-typografi";
import {Flatknapp} from "nav-frontend-knapper";
import UploadFileIcon from "../ikoner/UploadFile";
import {FormattedMessage} from "react-intl";
import React from "react";

type ChangeEvent = React.FormEvent<HTMLInputElement>;

const AddFile: React.FC<{
    typeTekst: string;
    tilleggsinfoTekst: string | undefined;
    oppgaveElement: DokumentasjonEtterspurtElement;
    oppgaveElementIndex: number;
    oppgaveIndex: number;
    setListeMedFilerSomFeiler: (filerMedFeil: Array<FilFeil>) => void;
    oppgaveId: string;
    setOverMaksStorrelse: (overMaksStorrelse: boolean) => void;
}> = ({
    typeTekst,
    tilleggsinfoTekst,
    oppgaveElement,
    oppgaveElementIndex,
    oppgaveIndex,
    setListeMedFilerSomFeiler,
    oppgaveId,
    setOverMaksStorrelse,
}) => {
    const dispatch = useDispatch();

    const kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggTillat(kommuneResponse);

    const onClick = (oppgaveElementIndex: number, event?: any): void => {
        const handleOnLinkClicked = (response: boolean) => {
            dispatch(setFileAttachmentsUploadFailed(response));
        };
        if (handleOnLinkClicked) {
            handleOnLinkClicked(false);
        }
        const uploadElement: any = document.getElementById("file_" + oppgaveIndex + "_" + oppgaveElementIndex);
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    const onChange = (
        event: any,
        oppgaveElement: DokumentasjonEtterspurtElement,
        oppgaveElementIndex: number,
        oppgaveIndex: number
    ) => {
        setListeMedFilerSomFeiler([]);
        setOverMaksStorrelse(false);
        const files: FileList | null = event.currentTarget.files;
        if (files) {
            dispatch(setFileUploadFailed(oppgaveId, false));
            dispatch(setFileUploadFailedInBackend(oppgaveId, false));
            dispatch(setFileUploadFailedVirusCheckInBackend(oppgaveId, false));

            const filerMedFeil: Array<FilFeil> = finnFilerMedFeil(files, oppgaveElementIndex);
            if (filerMedFeil.length === 0) {
                for (let index = 0; index < files.length; index++) {
                    const file: File = files[index];
                    if (!file) {
                        logInfoMessage("Tom fil ble forsøkt lagt til i OppgaveView.VelgFil.onChange()");
                    } else {
                        dispatch({
                            type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING,
                            oppgaveElement: oppgaveElement,
                            oppgaveElementIndex: oppgaveElementIndex,
                            oppgaveIndex: oppgaveIndex,
                            fil: {
                                filnavn: file.name,
                                status: "INITIALISERT",
                                file: file,
                            },
                        });
                    }
                }
            } else {
                setListeMedFilerSomFeiler(filerMedFeil);
                filerMedFeil.forEach((fil: FilFeil) => {
                    if (fil.containsUlovligeTegn) {
                        logInfoMessage("Validering vedlegg feilet: Fil inneholder ulovlige tegn");
                    }
                    if (fil.legalCombinedFilesSize) {
                        logInfoMessage("Validering vedlegg feilet: Totalt over 150MB ved en opplasting");
                    }
                    if (fil.legalFileExtension) {
                        logInfoMessage("Validering vedlegg feilet: Ulovlig filtype");
                    }
                    if (fil.legalFileSize) {
                        logInfoMessage("Validering vedlegg feilet: Fil over 10MB");
                    }
                });
            }
        }
        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    return (
        <div className={"oppgave-detalj-overste-linje"}>
            <div className={"tekst-wrapping"}>
                <Element>{typeTekst}</Element>
            </div>
            {tilleggsinfoTekst && (
                <div className={"tekst-wrapping"}>
                    <Normaltekst className="luft_over_4px">{tilleggsinfoTekst}</Normaltekst>
                </div>
            )}
            {kanLasteOppVedlegg && (
                <div className="oppgaver_last_opp_fil">
                    <Flatknapp
                        mini
                        id={"oppgave_" + oppgaveElementIndex + "_last_opp_fil_knapp"}
                        onClick={(event) => {
                            onClick(oppgaveElementIndex, event);
                        }}
                    >
                        <UploadFileIcon className="last_opp_fil_ikon" />
                        <Element>
                            <FormattedMessage id="vedlegg.velg_fil" />
                        </Element>
                    </Flatknapp>
                    <input
                        type="file"
                        id={"file_" + oppgaveIndex + "_" + oppgaveElementIndex}
                        multiple={true}
                        onChange={(event: ChangeEvent) =>
                            onChange(event, oppgaveElement, oppgaveElementIndex, oppgaveIndex)
                        }
                        style={{display: "none"}}
                    />
                </div>
            )}
        </div>
    );
};

export default AddFile;
