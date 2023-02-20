import {
    DokumentasjonEtterspurtElement,
    Fil,
    InnsynsdataActionTypeKeys,
} from "../../../redux/innsynsdata/innsynsdataReducer";
import React, {useEffect, useState} from "react";
import {
    alertUser,
    FileError,
    findFilesWithError,
    getVisningstekster,
    isFileErrorsNotEmpty,
    writeErrorMessage,
} from "../../../utils/vedleggUtils";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../../redux/reduxTypes";
import FileItemView from "./../FileItemView";
import AddFileButton, {TextAndButtonWrapper} from "./../AddFileButton";
import {v4 as uuidv4} from "uuid";
import {logInfoMessage} from "../../../redux/innsynsdata/loggActions";
import {BodyShort, Label} from "@navikt/ds-react";
import styles from "./dokumentasjonEtterspurt.module.css";
import {
    setFileUploadFailed,
    setFileUploadFailedInBackend,
    setFileUploadFailedVirusCheckInBackend,
} from "../../../redux/innsynsdata/innsynsDataActions";

const DokumentasjonEtterspurtElementView: React.FC<{
    oppgaveElement: DokumentasjonEtterspurtElement;
    oppgaveElementIndex: number;
    oppgaveId: string;
    oppgaveIndex: number;
}> = ({oppgaveElement, oppgaveElementIndex, oppgaveId, oppgaveIndex}) => {
    const uuid = uuidv4();
    const dispatch = useDispatch();
    const [listeMedFilerSomFeiler, setListeMedFilerSomFeiler] = useState<Array<FileError>>([]);

    const oppgaveVedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
    );
    let {typeTekst: tittel, tilleggsinfoTekst: beskrivelse} = getVisningstekster(
        oppgaveElement.dokumenttype,
        oppgaveElement.tilleggsinformasjon
    );

    useEffect(() => {
        if (oppgaveElement.filer && oppgaveElement.filer.length > 0) {
            window.addEventListener("beforeunload", alertUser);
        }
        return function unload() {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, [oppgaveElement.filer]);

    const visOppgaverDetaljeFeil: boolean = oppgaveVedlegsOpplastingFeilet || listeMedFilerSomFeiler.length > 0;

    const onDeleteClick = (event: any, vedleggIndex: number, fil: Fil) => {
        event.preventDefault();
        dispatch(setFileUploadFailedVirusCheckInBackend(oppgaveId, false));
        dispatch({
            type: InnsynsdataActionTypeKeys.FJERN_FIL_FOR_OPPLASTING,
            vedleggIndex: vedleggIndex,
            oppgaveElement: oppgaveElement,
            internalIndex: oppgaveElementIndex,
            externalIndex: oppgaveIndex,
            fil: fil,
        });
    };

    const onChange = (event: any) => {
        setListeMedFilerSomFeiler([]);
        const files: FileList | null = event.currentTarget.files;
        if (files) {
            const filesWithError: Array<FileError> = findFilesWithError(files, oppgaveElementIndex);
            if (filesWithError.length === 0) {
                onAddFileChange(files, oppgaveElementIndex, oppgaveElement);
            } else {
                setListeMedFilerSomFeiler(filesWithError);
                filesWithError.forEach((fil: FileError) => {
                    if (fil.containsIllegalCharacters) {
                        logInfoMessage("Validering vedlegg feilet: Fil inneholder ulovlige tegn");
                    }
                    if (fil.legalCombinedFilesSize) {
                        logInfoMessage("Validering vedlegg feilet: Totalt over 150MB ved en opplasting");
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

    const onAddFileChange = (
        files: FileList,
        internalIndex: number,
        oppgaveElement: DokumentasjonEtterspurtElement
    ) => {
        dispatch(setFileUploadFailed(oppgaveId, false));
        dispatch(setFileUploadFailedInBackend(oppgaveId, false));
        dispatch(setFileUploadFailedVirusCheckInBackend(oppgaveId, false));

        Array.from(files).forEach((file: File) => {
            if (!file) {
                logInfoMessage("Tom fil ble forsøkt lagt til i OppgaveView.VelgFil.onChange()");
            } else {
                dispatch({
                    type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING,
                    internalIndex: internalIndex,
                    oppgaveElement: oppgaveElement,
                    externalIndex: oppgaveIndex,
                    fil: {
                        filnavn: file.name,
                        status: "INITIALISERT",
                        file: file,
                    },
                });
            }
        });
    };
    return (
        <div className={"oppgaver_detalj" + (visOppgaverDetaljeFeil ? " oppgaver_detalj_feil" : "")}>
            <TextAndButtonWrapper>
                <div className={"tekst-wrapping"}>
                    <Label as="p">{tittel}</Label>
                    {beskrivelse && <BodyShort>{beskrivelse}</BodyShort>}
                </div>

                <AddFileButton onChange={onChange} referanse={oppgaveId} id={uuid} />
            </TextAndButtonWrapper>

            <ul className={styles.unorderedList}>
                {oppgaveElement.filer &&
                    oppgaveElement.filer.map((fil: Fil, vedleggIndex: number) => (
                        <FileItemView
                            key={vedleggIndex}
                            fil={fil}
                            onDelete={(event: MouseEvent, fil) => {
                                onDeleteClick(event, vedleggIndex, fil);
                            }}
                        />
                    ))}
            </ul>
            {isFileErrorsNotEmpty(listeMedFilerSomFeiler) &&
                writeErrorMessage(listeMedFilerSomFeiler, oppgaveElementIndex)}
        </div>
    );
};

export default DokumentasjonEtterspurtElementView;
