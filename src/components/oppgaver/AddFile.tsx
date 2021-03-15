import {
    DokumentasjonEtterspurtElement,
    InnsynsdataActionTypeKeys,
    KommuneResponse,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {FilFeil, findFilesWithError} from "../../utils/vedleggUtils";
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
    title: string;
    description: string | undefined;
    oppgaveElement: DokumentasjonEtterspurtElement;
    internalIndex: number; // todo vurdere andre navn
    externalIndex: number; // todo vurdere andre navn
    setListeMedFilerSomFeiler: (filerMedFeil: Array<FilFeil>) => void;
    setOverMaksStorrelse: (overMaksStorrelse: boolean) => void;
}> = ({
    title,
    description,
    oppgaveElement,
    internalIndex,
    externalIndex,
    setListeMedFilerSomFeiler,
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
        const uploadElement: any = document.getElementById("file_" + externalIndex + "_" + oppgaveElementIndex);
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
            dispatch(setFileUploadFailed(oppgaveElementIndex.toString(), false));
            dispatch(setFileUploadFailedInBackend(oppgaveElementIndex.toString(), false));
            dispatch(setFileUploadFailedVirusCheckInBackend(oppgaveElementIndex.toString(), false));

            const filerMedFeil: Array<FilFeil> = findFilesWithError(files, oppgaveElementIndex);
            if (filerMedFeil.length === 0) {
                for (let index = 0; index < files.length; index++) {
                    const file: File = files[index];
                    if (!file) {
                        logInfoMessage("Tom fil ble forsøkt lagt til i OppgaveView.VelgFil.onChange()");
                    } else {
                        dispatch({
                            type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING,
                            oppgaveElement: oppgaveElement,
                            internalIndex: oppgaveElementIndex,
                            externalIndex: oppgaveIndex,
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
                <Element>{title}</Element>
            </div>
            {description && (
                <div className={"tekst-wrapping"}>
                    <Normaltekst className="luft_over_4px">{description}</Normaltekst>
                </div>
            )}
            {kanLasteOppVedlegg && (
                <div className="oppgaver_last_opp_fil">
                    <Flatknapp
                        mini
                        id={"oppgave_" + internalIndex + "_last_opp_fil_knapp"}
                        onClick={(event) => {
                            onClick(internalIndex, event);
                        }}
                    >
                        <UploadFileIcon className="last_opp_fil_ikon" />
                        <Element>
                            <FormattedMessage id="vedlegg.velg_fil" />
                        </Element>
                    </Flatknapp>
                    <input
                        type="file"
                        id={"file_" + externalIndex + "_" + internalIndex}
                        multiple={true}
                        onChange={(event: ChangeEvent) => onChange(event, oppgaveElement, internalIndex, externalIndex)}
                        style={{display: "none"}}
                    />
                </div>
            )}
        </div>
    );
};

export default AddFile;
