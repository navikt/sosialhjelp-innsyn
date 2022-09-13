import {DokumentasjonEtterspurtElement, Fil, KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import React, {useEffect, useState} from "react";
import {alertUser} from "../../utils/vedleggUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import FileItemView from "./FileItemView";
import AddFileButton, {TextAndButtonWrapper} from "./AddFileButton";
import {v4 as uuidv4} from "uuid";
import {BodyShort, Label} from "@navikt/ds-react";
import {FileValidationErrors} from "./DokumentasjonkravElementView";
import {validateFile} from "./validateFile";
import {ErrorMessageTitle} from "./ErrorMessageTitleNew";
import ErrorMessage from "./ErrorMessage";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";

const DokumentasjonEtterspurtElementView: React.FC<{
    tittel: string;
    beskrivelse: string | undefined;
    oppgaveElement: DokumentasjonEtterspurtElement;
    oppgaveElementIndex: number;
    oppgaveId: string;
    dokumentasjonEtterspurtIndex: number;
    hendelseReferanse: string;
    onDelete: (event: any, hendelseReferanse: string, fil: Fil) => void;
    onAddFileChange: (event: any, hendelseReferanse: string, validFiles: Fil[]) => void;
    filer: Fil[];
}> = ({
    tittel,
    beskrivelse,
    oppgaveElement,
    oppgaveElementIndex,
    oppgaveId,
    dokumentasjonEtterspurtIndex,
    hendelseReferanse,
    onDelete,
    onAddFileChange,
    filer,
}) => {
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
        if (filer && filer.length > 0) {
            window.addEventListener("beforeunload", alertUser);
        }
        return function unload() {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, [filer]);

    const visOppgaverDetaljeFeil: boolean =
        oppgaveVedlegsOpplastingFeilet || (fileValidationErrors !== undefined && fileValidationErrors.errors.size > 0);

    const onDeleteElement = (event: any, fil: Fil) => {
        setFileValidationErrors(undefined);
        onDelete(event, hendelseReferanse, fil);
    };

    const onChange = (event: any) => {
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
            onAddFileChange(event, hendelseReferanse, result.validFiles);
        }
    };

    return (
        <div className={"oppgaver_detalj" + (visOppgaverDetaljeFeil ? " oppgaver_detalj_feil" : "")}>
            <TextAndButtonWrapper>
                <div className={"tekst-wrapping"}>
                    <Label>{tittel}</Label>
                    {beskrivelse && <BodyShort>{beskrivelse}</BodyShort>}
                </div>
                {canUploadAttatchemnts && (
                    <AddFileButton onChange={onChange} referanse={oppgaveElement.hendelsereferanse ?? ""} id={uuid} />
                )}
            </TextAndButtonWrapper>

            {filer.map((fil: Fil, vedleggIndex: number) => (
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
                            feilId={"vedlegg.ulovlig_flere_fil_feilmellding"}
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

export default DokumentasjonEtterspurtElementView;
