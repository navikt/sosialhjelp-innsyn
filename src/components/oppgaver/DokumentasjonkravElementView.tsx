import React, {useEffect, useState} from "react";
import {DokumentasjonKravElement, Fil, KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {alertUser} from "../../utils/vedleggUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import AddFileButton from "./AddFileButton";
import {Element, Normaltekst} from "nav-frontend-typografi";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import {v4 as uuidv4} from "uuid";
import FileItemView from "./FileItemView";
import ErrorMessage from "./ErrorMessage";
import {ErrorMessageTitle} from "./ErrorMessageTitleNew";
import {validateFile} from "./validateFile";

export interface FileValidationErrors {
    errors: Set<string>;
    filenames: Set<string>;
}

const DokumentasjonkravElementView: React.FC<{
    dokumentasjonkravElement: DokumentasjonKravElement;
    dokumentasjonKravIndex: number;
    dokumentasjonkravReferanse: string;
    onChange: (event: any, dokumentasjonkravReferanse: string, validFiles: Fil[]) => void;
    onDelete: (event: any, dokumentasjonkravReferanse: string, fil: Fil) => void;
}> = ({dokumentasjonkravElement, dokumentasjonkravReferanse, onChange, onDelete}) => {
    const uuid = uuidv4();
    const [fileValidationErrors, setFileValidationErrors] = useState<FileValidationErrors | undefined>(undefined);

    const oppgaveVedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
    );

    const kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const canUploadAttatchemnts: boolean = isFileUploadAllowed(kommuneResponse);

    useEffect(() => {
        if (dokumentasjonkravElement.filer && dokumentasjonkravElement.filer.length > 0) {
            window.addEventListener("beforeunload", alertUser);
        }
        return function unload() {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, [dokumentasjonkravElement.filer]);

    const visOppgaverDetaljeFeil: boolean =
        oppgaveVedlegsOpplastingFeilet || (fileValidationErrors !== undefined && fileValidationErrors.errors.size > 0);

    const onChangeElement = (event: any) => {
        setFileValidationErrors(undefined);
        const files: FileList | null = event.currentTarget.files;
        if (files) {
            const opplastedeFiler = Array.from(files).map((file: File) => {
                return {filnavn: file.name, status: "INITIALISERT", file: file};
            });

            const result = validateFile(opplastedeFiler);

            if (result.errors.size) {
                setFileValidationErrors({errors: result.errors, filenames: result.filenames});
            }

            onChange(event, dokumentasjonkravReferanse, result.validFiles);
        }
    };

    const onDeleteElement = (event: any, fil: Fil) => {
        setFileValidationErrors(undefined);
        onDelete(event, dokumentasjonkravReferanse, fil);
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
                {canUploadAttatchemnts && (
                    <AddFileButton
                        onChange={onChangeElement}
                        referanse={dokumentasjonkravElement.dokumentasjonkravReferanse ?? ""}
                        id={uuid}
                    />
                )}
            </div>

            {dokumentasjonkravElement.filer &&
                dokumentasjonkravElement.filer.map((fil: Fil, vedleggIndex: number) => (
                    <FileItemView key={vedleggIndex} fil={fil} onDelete={onDeleteElement} />
                ))}
            {fileValidationErrors && fileValidationErrors?.errors.size && (
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
                    {Array.from(fileValidationErrors.errors).map((key, index) => {
                        return <ErrorMessage feilId={key} key={index} />;
                    })}
                </div>
            )}
        </div>
    );
};

export default DokumentasjonkravElementView;
