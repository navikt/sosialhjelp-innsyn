import {
    DokumentasjonEtterspurtElement,
    DokumentasjonKravElement,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    KommuneResponse,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {FileError, findFilesWithError} from "../../utils/vedleggUtils";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
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
    oppgaveElement: DokumentasjonEtterspurtElement | DokumentasjonKravElement; //  -----må generaliseres i digisos-2093
    internalIndex: number; // disse 2 brukes til å skille hvor feilmeldinger
    externalIndex: number; // og filer ligger
    setListWithFilesWithErrors: (filesWithErrors: Array<FileError>) => void;
    setAboveMaxSize: (aboveMaxSize: boolean) => void;
    innsynDataSti: InnsynsdataSti;
}> = ({
    title,
    description,
    oppgaveElement,
    internalIndex,
    externalIndex,
    setListWithFilesWithErrors,
    setAboveMaxSize,
    innsynDataSti,
}) => {
    const dispatch = useDispatch();

    const kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const canUploadAttatchemnts: boolean = isFileUploadAllowed(kommuneResponse);

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

    function logFilesWithErrors(filesWithError: Array<FileError>) {
        filesWithError.forEach((fil: FileError) => {
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

    const onChange = (event: any) => {
        setListWithFilesWithErrors([]);
        setAboveMaxSize(false);
        const files: FileList | null = event.currentTarget.files;
        if (files) {
            dispatch(setFileUploadFailed(internalIndex.toString(), false));
            dispatch(setFileUploadFailedInBackend(internalIndex.toString(), false));
            dispatch(setFileUploadFailedVirusCheckInBackend(internalIndex.toString(), false));

            const filesWithError: Array<FileError> = findFilesWithError(files, internalIndex);
            if (filesWithError.length === 0) {
                Array.from(files).forEach((file: File) => {
                    if (!file) {
                        logInfoMessage("Tom fil ble forsøkt lagt til i OppgaveView.VelgFil.onChange()");
                    } else {
                        const actionType =
                            innsynDataSti === InnsynsdataSti.OPPGAVER
                                ? InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING
                                : InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_DOKUMENTASJONKRAV;
                        console.log("actiontype", actionType);
                        dispatch({
                            type: actionType,
                            internalIndex: internalIndex,
                            oppgaveElement: oppgaveElement,
                            externalIndex: externalIndex,
                            fil: {
                                filnavn: file.name,
                                status: "INITIALISERT",
                                file: file,
                            },
                        });
                    }
                });
            } else {
                setListWithFilesWithErrors(filesWithError);
                logFilesWithErrors(filesWithError);
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
                    {innsynDataSti}
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
                        onChange={(event: ChangeEvent) => onChange(event)}
                        style={{display: "none"}}
                    />
                </div>
            )}
        </div>
    );
};

export default AddFile;
