"use client";

import { FileObject, FileRejected, FileRejectionReason, FileUpload, Heading, VStack } from "@navikt/ds-react";
import { useController, UseControllerProps } from "react-hook-form";

import { FormValues } from "./klageForm";
import { MAX_SIZE_MB, MAX_SIZE, MAX_FILES } from "./consts";

const FileUploadField = ({ ...controllerProps }: UseControllerProps<FormValues, "files">) => {
    const {
        field: { value: files = [], onChange },
    } = useController(controllerProps);

    const acceptedFiles = files.filter((file) => !file.error);
    const rejectedFiles = files.filter((file): file is FileRejected => file.error);

    const onFileSelect = (newFiles: FileObject[]) => {
        onChange([...files, ...newFiles]);
    };

    const removeFile = (fileToRemove: FileObject) => {
        onChange(files.filter((file: FileObject) => file !== fileToRemove));
    };

    return (
        <VStack gap="6">
            <FileUpload.Dropzone
                label="Last opp filer til søknaden"
                description={`Du kan laste opp Word- og PDF-filer. Maks 3 filer. Maks størrelse ${MAX_SIZE_MB} MB.`}
                accept=".doc,.docx,.pdf"
                maxSizeInBytes={MAX_SIZE}
                fileLimit={{ max: MAX_FILES, current: acceptedFiles.length }}
                onSelect={(newFiles) => onFileSelect(newFiles)}
            />
            {acceptedFiles.length > 0 && (
                <VStack gap="2">
                    <Heading level="3" size="xsmall">
                        {`Vedlegg (${acceptedFiles.length})`}
                    </Heading>
                    <VStack as="ul" gap="3">
                        {acceptedFiles.map((file, index) => (
                            <FileUpload.Item
                                as="li"
                                key={index}
                                file={file.file}
                                button={{
                                    action: "delete",
                                    onClick: () => removeFile(file),
                                }}
                            />
                        ))}
                    </VStack>
                </VStack>
            )}
            {rejectedFiles.length > 0 && (
                <VStack gap="2">
                    <Heading level="3" size="xsmall">
                        Vedlegg med feil
                    </Heading>
                    <VStack as="ul" gap="3">
                        {rejectedFiles.map((rejected, index) => (
                            <FileUpload.Item
                                as="li"
                                key={index}
                                file={rejected.file}
                                error={fileErrors[rejected.reasons[0] as FileRejectionReason]}
                                button={{
                                    action: "delete",
                                    onClick: () => removeFile(rejected),
                                }}
                            />
                        ))}
                    </VStack>
                </VStack>
            )}
        </VStack>
    );
};

const fileErrors: Record<FileRejectionReason, string> = {
    fileType: "Filformatet støttes ikke",
    fileSize: `Filen er større enn ${MAX_SIZE_MB} MB`,
};

export default FileUploadField;
