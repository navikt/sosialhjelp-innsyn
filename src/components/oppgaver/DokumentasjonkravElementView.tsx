import React, {useEffect, useState} from "react";
import {DokumentasjonKravElement, Fil, InnsynsdataSti} from "../../redux/innsynsdata/innsynsdataReducer";
import AddFile from "./AddFile";
import FilView from "./FilView";
import {alertUser, FileError, isFileErrorsNotEmpty, writeErrorMessage} from "../../utils/vedleggUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";

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

    const oppgaveVedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
    );

    useEffect(() => {
        if (filer && filer.length > 0) {
            window.addEventListener("beforeunload", alertUser);
        }
        return function unload() {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, [filer]);

    const visOppgaverDetaljeFeil: boolean = oppgaveVedlegsOpplastingFeilet || listeMedFilerSomFeiler.length > 0;

    return (
        <div className={"oppgaver_detalj" + (visOppgaverDetaljeFeil ? " oppgaver_detalj_feil" : "")}>
            <AddFileButton onClick={onClick} />

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
