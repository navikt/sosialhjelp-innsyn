import React, {useEffect, useState} from "react";
import {
    DokumentasjonKravElement,
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    KommuneResponse,
} from "../../redux/innsynsdata/innsynsdataReducer";
import AddFile from "./AddFile";
import FilView from "./FilView";
import {
    alertUser,
    FileError,
    findFilesWithError,
    isFileErrorsNotEmpty,
    writeErrorMessage,
} from "../../utils/vedleggUtils";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import AddFileButton from "./AddFileButton";
import {Element, Normaltekst} from "nav-frontend-typografi";
import {Flatknapp} from "nav-frontend-knapper";
import UploadFileIcon from "../ikoner/UploadFile";
import {FormattedMessage} from "react-intl";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import {
    setFileAttachmentsUploadFailed,
    setFileUploadFailed,
    setFileUploadFailedInBackend,
    setFileUploadFailedVirusCheckInBackend,
} from "../../redux/innsynsdata/innsynsDataActions";
import {logInfoMessage} from "../../redux/innsynsdata/loggActions";

const DokumentasjonkravElementView: React.FC<{
    tittel: string;
    beskrivelse: string | undefined;
    dokumentasjonkravElement: DokumentasjonKravElement;
    dokumentasjonkravElementIndex: number;
    dokumentasjonKravIndex: number;
    dokumetasjonKravId: string;
    setOverMaksStorrelse: (overMaksStorrelse: boolean) => void;
    filer: Fil[];
}> = ({
    tittel,
    beskrivelse,
    dokumentasjonkravElement,
    dokumentasjonkravElementIndex,
    dokumentasjonKravIndex,
    dokumetasjonKravId,
    setOverMaksStorrelse,
    filer,
}) => {
    const [listeMedFilerSomFeiler, setListeMedFilerSomFeiler] = useState<Array<FileError>>([]);

    const dispatch = useDispatch();
    const oppgaveVedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
    );

    const kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const canUploadAttatchemnts: boolean = isFileUploadAllowed(kommuneResponse);

    useEffect(() => {
        if (filer && filer.length > 0) {
            window.addEventListener("beforeunload", alertUser);
        }
        return function unload() {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, [filer]);

    const visOppgaverDetaljeFeil: boolean = oppgaveVedlegsOpplastingFeilet || listeMedFilerSomFeiler.length > 0;

    const onClick = (uuid: string, event?: any): void => {
        const handleOnLinkClicked = (response: boolean) => {
            dispatch(setFileAttachmentsUploadFailed(response));
        };
        if (handleOnLinkClicked) {
            handleOnLinkClicked(false);
        }
        const uploadElement: any = document.getElementById("file_" + uuid);
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    const onChange = (uuid: string, event: any) => {
        //setListWithFilesWithErrors([]);
        //setAboveMaxSize(false);
        const files: FileList | null = event.currentTarget.files;
        if (files) {
            //dispatch(setFileUploadFailed(internalIndex.toString(), false));
            //dispatch(setFileUploadFailedInBackend(internalIndex.toString(), false));
            //dispatch(setFileUploadFailedVirusCheckInBackend(internalIndex.toString(), false));

            const filesWithError: Array<FileError> = findFilesWithError(files, uuid);
            if (filesWithError.length === 0) {
                Array.from(files).forEach((file: File) => {
                    if (!file) {
                        logInfoMessage("Tom fil ble forsøkt lagt til i OppgaveView.VelgFil.onChange()");
                    } else {
                        dispatch({
                            type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_DOKUMENTASJONKRAV,
                            dokumentasjonkravReferanse: dokumentasjonkravElement.dokumentasjonkravReferanse,
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
        <div className={"oppgaver_detalj" + (visOppgaverDetaljeFeil ? " oppgaver_detalj_feil" : "")}>
            <div className={"oppgave-detalj-overste-linje"}>
                <div className={"tekst-wrapping"}>
                    <Element>{dokumentasjonkravElement.tittel}</Element>
                </div>
                {dokumentasjonkravElement.beskrivelse && (
                    <div className={"tekst-wrapping"}>
                        <Normaltekst className="luft_over_4px">{dokumentasjonkravElement.beskrivelse}</Normaltekst>
                    </div>
                )}
                {canUploadAttatchemnts && <AddFileButton onClick={onClick} onChange={onChange} />}
            </div>

            {filer.map((fil: Fil, vedleggIndex: number) => (
                <FilView
                    key={vedleggIndex}
                    fil={fil}
                    oppgaveElement={dokumentasjonkravElement}
                    vedleggIndex={vedleggIndex}
                    oppgaveElementIndex={dokumentasjonkravElementIndex}
                    oppgaveIndex={dokumentasjonKravIndex}
                    setOverMaksStorrelse={setOverMaksStorrelse}
                    oppgaveId={dokumetasjonKravId}
                />
            ))}
            {isFileErrorsNotEmpty(listeMedFilerSomFeiler) &&
                writeErrorMessage(listeMedFilerSomFeiler, dokumentasjonKravIndex)}
        </div>
    );
};

export default DokumentasjonkravElementView;
