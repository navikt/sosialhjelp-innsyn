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
}> = ({
    tittel,
    beskrivelse,
    dokumentasjonkravElement,
    dokumentasjonkravElementIndex,
    dokumentasjonKravIndex,
    dokumetasjonKravId,
    setOverMaksStorrelse,
}) => {
    const [listeMedFilerSomFeiler, setListeMedFilerSomFeiler] = useState<Array<FileError>>([]);

    const oppgaveVedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
    );

    useEffect(() => {
        if (dokumentasjonkravElement.filer && dokumentasjonkravElement.filer.length > 0) {
            window.addEventListener("beforeunload", alertUser);
        }
        return function unload() {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, [dokumentasjonkravElement.filer]);

    const visOppgaverDetaljeFeil: boolean = oppgaveVedlegsOpplastingFeilet || listeMedFilerSomFeiler.length > 0;

    return (
        <div className={"oppgaver_detalj" + (visOppgaverDetaljeFeil ? " oppgaver_detalj_feil" : "")}>
            <AddFile
                title={tittel}
                description={beskrivelse}
                oppgaveElement={dokumentasjonkravElement}
                internalIndex={dokumentasjonkravElementIndex}
                externalIndex={dokumentasjonKravIndex}
                setListWithFilesWithErrors={setListeMedFilerSomFeiler}
                setAboveMaxSize={setOverMaksStorrelse}
                innsynDataSti={InnsynsdataSti.DOKUMENTASJONKRAV}
            />

            {dokumentasjonkravElement.filer &&
                dokumentasjonkravElement.filer.length > 0 &&
                dokumentasjonkravElement.filer.map((fil: Fil, vedleggIndex: number) => (
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
