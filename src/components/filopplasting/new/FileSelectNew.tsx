"use client";

import { useTranslations } from "next-intl";
import { Alert, BodyShort, FileObject, FileUpload, Heading, HStack, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";
import { logger } from "@navikt/next-logger";
import { allowedFileTypes } from "@components/filopplasting/new/consts";
import { getTusUploader } from "@components/filopplasting/new/utils/tusUploader";
import { DocumentState } from "@components/filopplasting/new/api/useDocumentState";

import FileUploadItem from "./FileUploadItem";

interface Props {
    id?: string;
    label?: string;
    description?: ReactNode;
    filesLabel?: string;
    tag?: ReactNode;
    isPending?: boolean;
    docState: DocumentState;
    uploadId: string;
}

const FileSelectNew = ({ label, description, tag, docState, id, filesLabel, uploadId }: Props) => {
    const t = useTranslations("Opplastingsboks");

    // Starter opplasting umiddelbart ved filvalg
    const onSelect = (_files: FileObject[]) => {
        const uploads = _files.map((file: FileObject) =>
            getTusUploader({
                id: uploadId,
                onProgress: (bytesSent, bytesTotal) => {
                    const progress = bytesSent / bytesTotal;
                    logger.info(progress);
                },
                file,
            })
        );
        uploads.forEach((upload) => upload.start());
    };
    const converted = docState.uploads?.some((upload) => upload.convertedFilename);
    return (
        <FileUpload
            id={id}
            className="mb-4"
            translations={{
                dropzone: {
                    buttonMultiple: t("button"),
                    or: t("eller"),
                    dragAndDropMultiple: t("dragAndDrop"),
                },
                item: {
                    uploading: t("uploading"),
                    deleteButtonTitle: t("delete"),
                },
            }}
        >
            <VStack gap="6">
                <FileUpload.Dropzone
                    className="flex flex-col"
                    // @ts-expect-error: Typen på Dropzone er string, men den sendes ned i en komponent som aksepterer ReactNode.
                    label={
                        <HStack justify="space-between">
                            <div>{label ?? t("tittel")}</div>
                            {tag}
                        </HStack>
                    }
                    description={description ?? t("beskrivelse")}
                    onSelect={onSelect}
                    accept={allowedFileTypes}
                    maxSizeInBytes={10 * 1024 * 1024}
                    multiple
                    disabled={(docState.uploads?.length ?? 0) >= 30}
                />
                {!!docState.uploads?.length && (
                    <VStack gap="2">
                        <Heading size="xsmall" level="3">
                            {filesLabel ?? t("filerTilOpplasting")}
                        </Heading>
                        {converted && (
                            <Alert variant="warning">
                                <HStack gap="2">
                                    <Heading size="small" level="4">
                                        {t("konvertert.tittel")}
                                    </Heading>
                                    <BodyShort>{t("konvertert.beskrivelse")}</BodyShort>
                                </HStack>
                            </Alert>
                        )}
                        <VStack as="ul" gap="2">
                            {docState.uploads?.map((upload) => (
                                <FileUploadItem
                                    key={upload.originalFilename}
                                    url={upload.signedUrl}
                                    uploadId={upload.id}
                                    convertedFilename={upload.convertedFilename}
                                    originalFilename={upload.originalFilename}
                                    validations={upload.validations}
                                />
                            ))}
                        </VStack>
                    </VStack>
                )}
            </VStack>
        </FileUpload>
    );
};

export default FileSelectNew;
