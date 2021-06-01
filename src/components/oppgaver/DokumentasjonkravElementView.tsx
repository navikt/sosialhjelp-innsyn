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
import {v4 as uuidv4} from "uuid";
import FileItemView from "./FileItemView";

const DokumentasjonkravElementView: React.FC<{
    tittel: string;
    beskrivelse: string | undefined;
    dokumentasjonkravElement: DokumentasjonKravElement;
    dokumentasjonkravElementIndex: number;
    dokumentasjonKravIndex: number;
    dokumetasjonKravId: string;
    setOverMaksStorrelse: (overMaksStorrelse: boolean) => void;
    onChange: (event: any, dokumentasjonkravReferanse: string) => void;
    onDelete: (event: any, dokumentasjonkravReferanse: string, fil: Fil) => void;
    filer: Fil[];
}> = ({
    tittel,
    beskrivelse,
    dokumentasjonkravElement,
    dokumentasjonkravElementIndex,
    dokumentasjonKravIndex,
    dokumetasjonKravId,
    setOverMaksStorrelse,
    onChange,
    onDelete,
    filer,
}) => {
    const [listeMedFilerSomFeiler, setListeMedFilerSomFeiler] = useState<Array<FileError>>([]);

    const uuid = uuidv4();

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
                {canUploadAttatchemnts && (
                    <AddFileButton
                        onChange={onChange}
                        referanse={dokumentasjonkravElement.dokumentasjonkravReferanse ?? ""}
                        id={uuid}
                    />
                )}
            </div>

            {filer.map((fil: Fil, vedleggIndex: number) => (
                //sende inn fjern fil som en ondelete click funksjon
                <FileItemView key={vedleggIndex} fil={fil} referanse={dokumetasjonKravId} onDelete={onDelete} />
            ))}
            {isFileErrorsNotEmpty(listeMedFilerSomFeiler) &&
                writeErrorMessage(listeMedFilerSomFeiler, dokumentasjonKravIndex)}
        </div>
    );
};

export default DokumentasjonkravElementView;
