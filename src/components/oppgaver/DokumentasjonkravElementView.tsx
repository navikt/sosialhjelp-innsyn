import React, {useEffect, useState} from "react";
import {DokumentasjonKravElement, Fil, KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {alertUser, FileError, isFileErrorsNotEmpty, writeErrorMessage} from "../../utils/vedleggUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import AddFileButton from "./AddFileButton";
import {Element, Normaltekst} from "nav-frontend-typografi";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import {v4 as uuidv4} from "uuid";
import FileItemView from "./FileItemView";
import {FileValidationErrors} from "./DokumentasjonKravView";
import ErrorMessage from "./ErrorMessage";
import {ErrorMessageTitle} from "./ErrorMessageTitleNew";

const DokumentasjonkravElementView: React.FC<{
    dokumentasjonkravElement: DokumentasjonKravElement;
    dokumentasjonKravIndex: number;
    dokumetasjonKravId: string;
    onChange: (event: any, dokumentasjonkravReferanse: string) => void;
    onDelete: (event: any, dokumentasjonkravReferanse: string, fil: Fil) => void;
    filer: Fil[];
    fileValidationErrors?: FileValidationErrors;
}> = ({
    dokumentasjonkravElement,
    dokumentasjonKravIndex,
    dokumetasjonKravId,
    onChange,
    onDelete,
    filer,
    fileValidationErrors,
}) => {
    const uuid = uuidv4();

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

    const visOppgaverDetaljeFeil: boolean =
        oppgaveVedlegsOpplastingFeilet || (fileValidationErrors !== undefined && fileValidationErrors.errors.size > 0);

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
            {fileValidationErrors?.errors.size && (
                <div>
                    {fileValidationErrors.filenames.size === 1 ? (
                        <ErrorMessageTitle
                            feilId={"vedlegg.ulovlig_en_fil_feilmelding"}
                            errorValue={{filnavn: Array.from(fileValidationErrors.filenames)[0]}}
                        />
                    ) : (
                        <ErrorMessageTitle
                            feilId={"vedlegg.ulovlig_flere_fil_feilmelding"}
                            errorValue={{antallFiler: fileValidationErrors.filenames.size}}
                        />
                    )}
                    {Object.keys(fileValidationErrors.errors).map((key) => {
                        return <ErrorMessage feilId={key} />;
                    })}
                </div>
            )}
        </div>
    );
};

export default DokumentasjonkravElementView;
