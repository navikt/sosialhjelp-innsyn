import React, {useEffect, useState} from "react";
import {DokumentasjonKravElement, Fil} from "../../../redux/innsynsdata/innsynsdataReducer";
import {alertUser, illegalCombinedFilesSize} from "../../../utils/vedleggUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../../redux/reduxTypes";
import {isFileUploadAllowed} from "../../driftsmelding/DriftsmeldingUtilities";
import {v4 as uuidv4} from "uuid";
import AddFileButton, {TextAndButtonWrapper} from "../../vedlegg/AddFileButton";
import FileItemView from "../../vedlegg/FileItemView";
import ErrorMessage from "../ErrorMessage";
import {ErrorMessage as ErrorMessageLabel} from "../../errors/ErrorMessage";
import {ErrorMessageTitle} from "../ErrorMessageTitleNew";
import {validateFile} from "../validateFile";
import {BodyShort, Label} from "@navikt/ds-react";
import useKommune from "../../../hooks/useKommune";
import styled from "styled-components";
import {FormattedMessage} from "react-intl";

const StyledFrame = styled.div<{hasError?: boolean}>`
    padding: 1rem;
    margin-top: 16px;
    background-color: ${(props) => (props.hasError ? "var(--a-red-50)" : "var(--a-gray-200)")};
    border-radius: 2px;
    border-color: ${(props) => (props.hasError ? "var(--a-red-500)" : "var(--a-gray-200)")};
    border-width: 1px;
    border-style: solid;
`;

export interface FileValidationErrors {
    errors: Set<string>;
    filenames: Set<string>;
}

const DokumentasjonkravElementView: React.FC<{
    dokumentasjonkravElement: DokumentasjonKravElement;
    onChange: (event: any, dokumentasjonkravReferanse: string, validFiles: Fil[]) => void;
    onDelete: (event: any, dokumentasjonkravReferanse: string, fil: Fil) => void;
    setFilesHasErrors: (fileHasErrors: boolean) => void;
    setOverMaksStorrelse: (setOverMaksStorrelse: boolean) => void;
    overMaksStorrelse: boolean;
    fileUploadingBackendFailed: boolean;
    setFileUploadingBackendFailed: (setFileUploadingBackendFailed: boolean) => void;
    filer: Fil[];
}> = ({
    dokumentasjonkravElement,
    onChange,
    onDelete,
    setFilesHasErrors,
    setOverMaksStorrelse,
    overMaksStorrelse,
    fileUploadingBackendFailed,
    setFileUploadingBackendFailed,
    filer,
}) => {
    const uuid = uuidv4();
    const [fileValidationErrors, setFileValidationErrors] = useState<FileValidationErrors | undefined>(undefined);
    const [concatenatedSizeOfFilesMessage, setConcatenatedSizeOfFilesMessage] = useState<string | undefined>(undefined);

    const oppgaveVedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
    );

    const {kommune} = useKommune();
    const canUploadAttatchemnts: boolean = isFileUploadAllowed(kommune);
    const dokumentasjonkravReferanse = dokumentasjonkravElement.dokumentasjonkravReferanse ?? "";

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
        overMaksStorrelse ||
        fileUploadingBackendFailed;

    const onChangeElement = (event: any) => {
        setFileValidationErrors(undefined);
        setConcatenatedSizeOfFilesMessage(undefined);
        setOverMaksStorrelse(false);
        setFilesHasErrors(false);
        setFileUploadingBackendFailed(false);
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
                    onChange(event, dokumentasjonkravReferanse, validatedFiles.validFiles);
                }
            }
        }
    };

    const onDeleteElement = (event: any, fil: Fil) => {
        setFileValidationErrors(undefined);
        setOverMaksStorrelse(false);
        setConcatenatedSizeOfFilesMessage(undefined);
        setFilesHasErrors(false);
        setFileUploadingBackendFailed(false);
        onDelete(event, dokumentasjonkravReferanse, fil);
    };

    return (
        <StyledFrame hasError={visOppgaverDetaljeFeil}>
            <TextAndButtonWrapper>
                <div className={"tekst-wrapping"}>
                    <Label as="p">{dokumentasjonkravElement.tittel}</Label>
                    {dokumentasjonkravElement.beskrivelse && (
                        <BodyShort>{dokumentasjonkravElement.beskrivelse}</BodyShort>
                    )}
                </div>

                {canUploadAttatchemnts && (
                    <AddFileButton
                        onChange={onChangeElement}
                        referanse={dokumentasjonkravElement.dokumentasjonkravReferanse ?? ""}
                        id={uuid}
                    />
                )}
            </TextAndButtonWrapper>

            <FileItemView filer={filer} onDelete={onDeleteElement} />
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
        </StyledFrame>
    );
};

export default DokumentasjonkravElementView;
