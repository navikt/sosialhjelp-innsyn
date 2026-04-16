"use client";

import { useTranslations } from "next-intl";
import { BodyShort, FileObject, FileUpload, Heading, InlineMessage, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";
import { logger } from "@navikt/next-logger";
import { getTusUploader } from "@components/filopplasting/utils/tusUploader";
import { DocumentState } from "@components/filopplasting/api/useDocumentState";

import FileUploadItem from "./FileUploadItem";
import { FileSelectUpload } from "@components/filopplasting/FileSelectUpload";
import { browserEnv } from "@config/env";
import { useParams } from "next/navigation";
import { SubmissionError } from "@components/filopplasting/api/useSendVedleggHelperTus";

interface Props {
    id?: string;
    label?: string;
    description?: string;
    filesLabel?: string;
    tag?: ReactNode;
    isPending?: boolean;
    docState: DocumentState;
    uploadId: string;
    errors?: (typeof SubmissionError)[];
}

const FileSelectNew = ({ label, description, tag, docState, id, filesLabel, uploadId, errors }: Props) => {
    const t = useTranslations("Opplastingsboks");
    const { id: fiksDigisosId } = useParams<{ id: string }>();

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
                fiksDigisosId,
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
                            <InlineMessage
                                status={"info"}
                                className="border border-ax-border-info-subtle bg-ax-bg-info-moderate p-2 rounded-xl"
                            >
                                {t("konvertert")}
                            </InlineMessage>
                        )}
                        {(errors?.length ?? 0) > 0 && (
                            <>
                                {errors?.map((error) => (
                                    <InlineMessage
                                        key={`${error}`}
                                        status={"error"}
                                        className="border border-ax-border-error-subtle bg-ax-bg-error-moderate p-2 rounded-xl"
                                    >
                                        {t(`submissionError.${error}`)}
                                    </InlineMessage>
                                ))}
                            </>
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
                                    status={upload.status}
                                    size={upload.size}
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
