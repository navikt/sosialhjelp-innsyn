"use client";

import { FileObject, FileRejected, FileRejectionReason, FileUpload, Heading, VStack } from "@navikt/ds-react";
import { useController, UseControllerProps } from "react-hook-form";
import { useTranslations } from "next-intl";

import { FormValues } from "./klageForm";
import { MAX_SIZE_MB, MAX_SIZE, MAX_FILES } from "./consts";

const FileUploadField = ({ ...controllerProps }: UseControllerProps<FormValues, "files">) => {
    const {
        field: { value: files = [], onChange },
    } = useController(controllerProps);
    const t = useTranslations("KlageFileUpload");

    const acceptedFiles = files.filter((file) => !file.error);
    const rejectedFiles = files.filter((file): file is FileRejected => file.error);

    const onFileSelect = (newFiles: FileObject[]) => {
        onChange([...files, ...newFiles]);
    };

    const removeFile = (fileToRemove: FileObject) => {
        onChange(files.filter((file: FileObject) => file !== fileToRemove));
    };

    const fileErrors: Record<FileRejectionReason, string> = {
        fileType: t("validering.ugyldigFiltype"),
        fileSize: t("validering.storrelse", {
            maksFilstørrelse: MAX_SIZE_MB,
        }),
    };

    return (
        <FileUpload
            translations={{
                dropzone: {
                    button: t("dropzone.button"),
                    buttonMultiple: t("dropzone.buttonMultiple"),
                    dragAndDrop: t("dropzone.dragAndDrop"),
                    dragAndDropMultiple: t("dropzone.dragAndDropMultiple"),
                    drop: t("dropzone.drop"),
                    or: t("dropzone.or"),
                    disabled: t("dropzone.disabled"),
                    disabledFilelimit: t("dropzone.disabledFilelimit"),
                },
                item: {
                    retryButtonTitle: t("item.retryButtonTitle"),
                    deleteButtonTitle: t("item.deleteButtonTitle"),
                    uploading: t("item.uploading"),
                    downloading: t("item.downloading"),
                },
            }}
        >
            <VStack gap="6">
                <FileUpload.Dropzone
                    label={t("label")}
                    description={t("beskrivelse", { maxSize: MAX_SIZE_MB })}
                    accept=".doc,.docx,.pdf,.img,.jpeg,.jpg,.png"
                    maxSizeInBytes={MAX_SIZE}
                    fileLimit={{ max: MAX_FILES, current: acceptedFiles.length }}
                    onSelect={(newFiles) => onFileSelect(newFiles)}
                />
                {acceptedFiles.length > 0 && (
                    <VStack gap="2">
                        <Heading level="3" size="xsmall">
                            {t("vedlegg", { numberOfFiles: acceptedFiles.length })}
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
                            {t("vedleggMedFeil", { numberOfFiles: rejectedFiles.length })}
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
        </FileUpload>
    );
};

export default FileUploadField;
