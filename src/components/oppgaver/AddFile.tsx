import {
    DokumentasjonEtterspurtElement,
    InnsynsdataActionTypeKeys,
    KommuneResponse,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {FileErrors, findFilesWithError} from "../../utils/vedleggUtils";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {isUploadFilesAllowed} from "../driftsmelding/DriftsmeldingUtilities";
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
    oppgaveElement: DokumentasjonEtterspurtElement; // todo må generaliseres
    internalIndex: number; // todo vurdere andre navn
    externalIndex: number; // todo vurdere andre navn
    setListWithFilesWithErrors: (filesWithErrors: Array<FileErrors>) => void;
    setAboveMaxSize: (aboveMaxSize: boolean) => void;
}> = ({
    title,
    description,
    oppgaveElement,
    internalIndex,
    externalIndex,
    setListWithFilesWithErrors,
    setAboveMaxSize,
}) => {
    const dispatch = useDispatch();

    const kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const canUploadAttatchemnts: boolean = isUploadFilesAllowed(kommuneResponse);

    const onClick = (internalId: number, event?: any): void => {
        const handleOnLinkClicked = (response: boolean) => {
            dispatch(setFileAttachmentsUploadFailed(response));
        };
        if (handleOnLinkClicked) {
            handleOnLinkClicked(false);
        }
        const uploadElement: any = document.getElementById("file_" + externalIndex + "_" + internalId);
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    const onChange = (event: any, oppgaveElement: DokumentasjonEtterspurtElement) => {
        setListWithFilesWithErrors([]);
        setAboveMaxSize(false);
        const files: FileList | null = event.currentTarget.files;
        if (files) {
            dispatch(setFileUploadFailed(internalIndex.toString(), false));
            dispatch(setFileUploadFailedInBackend(internalIndex.toString(), false));
            dispatch(setFileUploadFailedVirusCheckInBackend(internalIndex.toString(), false));

            const filerMedFeil: Array<FileErrors> = findFilesWithError(files, internalIndex);
            if (filerMedFeil.length === 0) {
                for (let index = 0; index < files.length; index++) {
                    const file: File = files[index];
                    if (!file) {
                        logInfoMessage("Tom fil ble forsøkt lagt til i OppgaveView.VelgFil.onChange()");
                    } else {
                        dispatch({
                            type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING,
                            oppgaveElement: oppgaveElement,
                            internalIndex: internalIndex,
                            externalIndex: externalIndex,
                            fil: {
                                filename: file.name,
                                status: "INITIALISERT",
                                file: file,
                            },
                        });
                    }
                }
            } else {
                setListWithFilesWithErrors(filerMedFeil);
                filerMedFeil.forEach((fil: FileErrors) => {
                    if (fil.containsIllegalCharacters) {
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
            {canUploadAttatchemnts && (
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
                        onChange={(event: ChangeEvent) => onChange(event, oppgaveElement)}
                        style={{display: "none"}}
                    />
                </div>
            )}
        </div>
    );
};

export default AddFile;
