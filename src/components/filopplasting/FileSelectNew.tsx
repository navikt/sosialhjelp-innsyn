"use client";

import { useTranslations } from "next-intl";
import { Alert, BodyShort, FileObject, FileUpload, Heading, HStack, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";
import { logger } from "@navikt/next-logger";
import { getTusUploader } from "@components/filopplasting/utils/tusUploader";
import { DocumentState } from "@components/filopplasting/api/useDocumentState";

import FileUploadItem from "./FileUploadItem";
import { FileSelectUpload } from "@components/filopplasting/FileSelectUpload";
import { browserEnv } from "@config/env";

interface Props {
    id?: string;
    label?: string;
    description?: string;
    filesLabel?: string;
    tag?: ReactNode;
    isPending?: boolean;
    docState: DocumentState;
    uploadId: string;
}

const FileSelectNew = ({ label, description, tag, docState, id, filesLabel, uploadId }: Props) => {
    const t = useTranslations("Opplastingsboks");

    // Starter opplasting umiddelbart ved filvalg
    const onSelect = (files: FileObject[]) => {
        const uploads = files.map((file: FileObject) =>
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
    const converted = docState.uploads?.some(
        (upload) => !!upload.finalFilename && upload.finalFilename !== upload.originalFilename
    );
    return (
        <FileUpload
            id={id}
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
            <VStack gap="space-24">
                <FileSelectUpload
                    label={
                        label ? (
                            <BodyShort as="span" lang="no">
                                {label}
                            </BodyShort>
                        ) : (
                            t("tittel")
                        )
                    }
                    tag={tag}
                    description={description}
                    buttonText={t("lastOppFiler")}
                    onSelect={onSelect}
                    disabled={(docState.uploads?.length ?? 0) >= 30}
                />

                {!!docState.uploads?.length && (
                    <VStack gap="space-8">
                        <Heading size="xsmall" level="3">
                            {filesLabel ?? t("valgteFiler", { antall_filer: docState.uploads.length })}
                        </Heading>
                        {converted && (
                            <Alert variant="warning">
                                <HStack gap="space-8">
                                    <Heading size="small" level="4">
                                        {t("konvertert.tittel")}
                                    </Heading>
                                    <BodyShort>{t("konvertert.beskrivelse")}</BodyShort>
                                </HStack>
                            </Alert>
                        )}
                        <VStack as="ul" gap="space-8">
                            {docState.uploads?.map((upload) => (
                                <FileUploadItem
                                    key={upload.originalFilename}
                                    url={
                                        upload.url
                                            ? `${browserEnv.NEXT_PUBLIC_BASE_PATH}/api/upload-api${upload.url}`
                                            : undefined
                                    }
                                    uploadId={upload.id}
                                    convertedFilename={upload.finalFilename}
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
