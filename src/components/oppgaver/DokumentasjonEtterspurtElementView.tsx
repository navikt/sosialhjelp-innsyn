import {Fil, DokumentasjonEtterspurtElement} from "../../redux/innsynsdata/innsynsdataReducer";
import React, {useEffect, useState} from "react";
import {
    isFileErrorsNotEmpty,
    alertUser,
    writeErrorMessage,
    FileError,
    findFilesWithError,
} from "../../utils/vedleggUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import FileItemView from "./FileItemView";
import AddFileButton from "./AddFileButton";
import {v4 as uuidv4} from "uuid";
import {logInfoMessage} from "../../redux/innsynsdata/loggActions";
import {Element, Normaltekst} from "nav-frontend-typografi";

const DokumentasjonEtterspurtElementView: React.FC<{
    tittel: string;
    beskrivelse: string | undefined;
    oppgaveElement: DokumentasjonEtterspurtElement;
    oppgaveElementIndex: number;
    oppgaveId: string;
    setOverMaksStorrelse: (overMaksStorrelse: boolean) => void;
    onDelete: (oppgaveId: string, vedleggIndex: number, fil: Fil) => void;
    onAddFileChange: (files: FileList, internalIndex: number, oppgaveElement: DokumentasjonEtterspurtElement) => void;
}> = ({
    tittel,
    beskrivelse,
    oppgaveElement,
    oppgaveElementIndex,
    oppgaveId,
    setOverMaksStorrelse,
    onDelete,
    onAddFileChange,
}) => {
    const uuid = uuidv4();
    const [listeMedFilerSomFeiler, setListeMedFilerSomFeiler] = useState<Array<FileError>>([]);

    const oppgaveVedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
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
        onDelete(oppgaveId, vedleggIndex, fil);
    };

    const onChange = (event: any) => {
        setListeMedFilerSomFeiler([]);
        setOverMaksStorrelse(false);
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

    return (
        <div className={"oppgaver_detalj" + (visOppgaverDetaljeFeil ? " oppgaver_detalj_feil" : "")}>
            <div className={"tekst-wrapping"}>
                <Element>{tittel}</Element>
            </div>
            {beskrivelse && (
                <div className={"tekst-wrapping"}>
                    <Normaltekst className="luft_over_4px">{beskrivelse}</Normaltekst>
                </div>
            )}
            <AddFileButton onChange={onChange} referanse={oppgaveId} id={uuid} />

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
            {isFileErrorsNotEmpty(listeMedFilerSomFeiler) &&
                writeErrorMessage(listeMedFilerSomFeiler, oppgaveElementIndex)}
        </div>
    );
};

export default DokumentasjonEtterspurtElementView;
