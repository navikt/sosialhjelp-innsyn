import {DokumentasjonEtterspurtElement, Fil, KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import React, {useEffect, useState} from "react";
import {alertUser, illegalCombinedFilesSize} from "../../utils/vedleggUtils";
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
import styled from "styled-components/macro";
import {ErrorMessage as ErrorMessageLabel} from "../errors/ErrorMessage";
import {FormattedMessage} from "react-intl";

const StyledErrorFrame = styled.div<{hasError?: boolean}>`
    padding: 1rem;
    margin-top: 16px;
    background-color: ${(props) =>
        props.hasError
            ? "var(--navds-semantic-color-feedback-danger-background)"
            : "var(--navds-semantic-color-canvas-background)"};
    border-radius: 2px;
    border-color: ${(props) =>
        props.hasError ? "var(--navds-alert-color-error-border)" : "var(--navds-semantic-color-border-inverted)"};
    border-width: 1px;
    border-style: solid;
`;

const DokumentasjonEtterspurtElementView: React.FC<{
    tittel: string;
    beskrivelse: string | undefined;
    oppgaveElement: DokumentasjonEtterspurtElement;
    hendelseReferanse: string;
    onDelete: (event: any, hendelseReferanse: string, fil: Fil) => void;
    onAddFileChange: (event: any, hendelseReferanse: string, validFiles: Fil[]) => void;
    setFilesHasErrors: (filesHasErrors: boolean) => void;
    setOverMaksStorrelse: (setOverMaksStorrelse: boolean) => void;
    overMaksStorrelse: boolean;
    fileUploadingBackendFailed: boolean;
    filer: Fil[];
}> = ({
    tittel,
    beskrivelse,
    oppgaveElement,
    hendelseReferanse,
    onDelete,
    onAddFileChange,
    setFilesHasErrors,
    setOverMaksStorrelse,
    overMaksStorrelse,
    fileUploadingBackendFailed,
    filer,
}) => {
    const uuid = uuidv4();
    const [fileValidationErrors, setFileValidationErrors] = useState<FileValidationErrors | undefined>(undefined);
    const [concatenatedSizeOfFilesMessage, setConcatenatedSizeOfFilesMessage] = useState<string | undefined>(undefined);

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
        oppgaveVedlegsOpplastingFeilet ||
        (fileValidationErrors !== undefined && fileValidationErrors.errors.size > 0) ||
        concatenatedSizeOfFilesMessage !== undefined ||
        fileUploadingBackendFailed;

    const onDeleteElement = (event: any, fil: Fil) => {
        setOverMaksStorrelse(false);
        setConcatenatedSizeOfFilesMessage(undefined);
        setFileValidationErrors(undefined);
        setFilesHasErrors(false);
        onDelete(event, hendelseReferanse, fil);
    };

    const onChange = (event: any) => {
        setFileValidationErrors(undefined);
        setConcatenatedSizeOfFilesMessage(undefined);
        setOverMaksStorrelse(false);
        setFilesHasErrors(false);
        const files: FileList | null = event.currentTarget.files;
        if (files) {
            const opplastedeFiler = Array.from(files).map((file: File) => {
                return {filnavn: file.name, status: "INITIALISERT", file: file};
            });

            const validatedFiles = validateFile(opplastedeFiler);

            const totalSizeOfValidatedFiles = validatedFiles.validFiles.reduce(
                (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
                0
            );

            if (illegalCombinedFilesSize(totalSizeOfValidatedFiles)) {
                setOverMaksStorrelse(true);
                setConcatenatedSizeOfFilesMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            } else {
                if (validatedFiles.errors.size) {
                    setFileValidationErrors({errors: validatedFiles.errors, filenames: validatedFiles.filenames});
                    setFilesHasErrors(true);
                } else {
                    onAddFileChange(event, hendelseReferanse, validatedFiles.validFiles);
                }
            }
        }
    };

    return (
        <StyledErrorFrame hasError={visOppgaverDetaljeFeil}>
            <TextAndButtonWrapper>
                <div className={"tekst-wrapping"}>
                    <Label as="p">{tittel}</Label>
                    {beskrivelse && <BodyShort>{beskrivelse}</BodyShort>}
                </div>
                {canUploadAttatchemnts && (
                    <AddFileButton onChange={onChange} referanse={oppgaveElement.hendelsereferanse ?? ""} id={uuid} />
                )}
            </TextAndButtonWrapper>

            {filer.map((fil: Fil, vedleggIndex: number) => (
                <FileItemView key={vedleggIndex} fil={fil} onDelete={onDeleteElement} />
            ))}
            {fileValidationErrors && fileValidationErrors?.errors.size && !overMaksStorrelse && (
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
            {concatenatedSizeOfFilesMessage && (
                <ErrorMessageLabel>
                    <FormattedMessage id={concatenatedSizeOfFilesMessage} />
                </ErrorMessageLabel>
            )}
        </StyledErrorFrame>
    );
};

export default DokumentasjonEtterspurtElementView;
