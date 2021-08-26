import {Fil, DokumentasjonEtterspurtElement} from "../../redux/innsynsdata/innsynsdataReducer";
import React, {useEffect, useState} from "react";
import {isFileErrorsNotEmpty, alertUser, writeErrorMessage, FileError} from "../../utils/vedleggUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import AddFile from "./AddFile";
import FileItemView from "./FileItemView";
import AddFileButton from "./AddFileButton";
import {v4 as uuidv4} from "uuid";

const DokumentasjonEtterspurtElementView: React.FC<{
    typeTekst: string;
    tilleggsinfoTekst: string | undefined;
    oppgaveElement: DokumentasjonEtterspurtElement;
    oppgaveElementIndex: number;
    oppgaveIndex: number;
    oppgaveId: string;
    setOverMaksStorrelse: (overMaksStorrelse: boolean) => void;
    onDelete: (oppgaveId: string, vedleggIndex: number, fil: Fil) => void;
}> = ({
    typeTekst,
    tilleggsinfoTekst,
    oppgaveElement,
    oppgaveElementIndex,
    oppgaveIndex,
    oppgaveId,
    setOverMaksStorrelse,
    onDelete,
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

    const onChange = (event: any) => {};

    return (
        <div className={"oppgaver_detalj" + (visOppgaverDetaljeFeil ? " oppgaver_detalj_feil" : "")}>
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
