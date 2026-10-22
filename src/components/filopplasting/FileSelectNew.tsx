"use client";

import { useTranslations } from "next-intl";
import { FileObject, FileUpload, Heading, VStack } from "@navikt/ds-react";
import InlineStatusMessage from "@components/filopplasting/InlineStatusMessage";
import { ReactNode, useRef } from "react";
import { DocumentState, UploadState } from "@components/filopplasting/api/useDocumentState";

import FileUploadItem from "./FileUploadItem";
import { FileSelectUpload } from "@components/filopplasting/FileSelectUpload";
import { browserEnv } from "@config/env";
import useSlowProcessingWarning from "@components/filopplasting/useSlowProcessingWarning";
import { useDocumentUpload } from "./useDocumentUpload";
import { UploadTarget } from "./utils/tusUploader";

interface Props {
    label?: string | null;
    description?: string | null;
    filesLabel?: string;
    tag?: ReactNode;
    isPending?: boolean;
    docState: DocumentState;
    contextId: string;
    target: UploadTarget;
    onSelect?: (files: FileObject[]) => void;
    onUploadsAdded: (uploads: UploadState[]) => void;
    onUploadRemoved: (correlationId: string) => void;
    variant?: "normal" | "warning";
    headingLevel?: "2" | "3";
}

const FileSelectNew = ({
    label,
    description,
    tag,
    docState,
    filesLabel,
    contextId,
    target,
    variant,
    onSelect,
    onUploadsAdded,
    onUploadRemoved,
    isPending,
    headingLevel,
}: Props) => {
    const t = useTranslations("Opplastingsboks");
    // Fokusmål som flyttes til før en slettet rad fjernes. Ellers sender nettleseren fokus til <body>.
    const focusAnchorRef = useRef<HTMLDivElement>(null);

    const { startUpload, terminateUpload, folderDropError } = useDocumentUpload({
        docState,
        contextId,
        onUploadRemoved,
        onUploadsAdded,
        onSelect,
        target,
    });

    const hasPendingOrProcessing = docState.uploads?.some((u) => u.status === "PENDING" || u.status === "PROCESSING");

    const showSlowProcessingWarning = useSlowProcessingWarning(hasPendingOrProcessing);

    const converted = docState.uploads?.some((upload) => upload.converted);

    return (
        <FileUpload
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
            <div ref={focusAnchorRef} tabIndex={-1} className="sr-only" />
            <VStack gap="space-24">
                <FileSelectUpload
                    label={label ?? t("tittel")}
                    headerId={`header-id-${contextId}`}
                    description={description}
                    tag={tag}
                    variant={variant === "warning" ? "warning" : "default"}
                    headingLevel={headingLevel}
                    buttonText={t("lastOppFiler")}
                    onSelect={(files) => startUpload(files)}
                    currentCount={docState.uploads?.length ?? 0}
                />

                {folderDropError && (
                    <InlineStatusMessage variant="error" role="alert">
                        {t("mappeIkkeTillatt")}
                    </InlineStatusMessage>
                )}

                {!!docState.uploads?.length && (
                    <VStack gap="space-8">
                        <Heading size="xsmall" level="3">
                            {filesLabel ?? t("valgteFiler", { antall_filer: docState.uploads.length })}
                        </Heading>
                        {converted && (
                            <InlineStatusMessage variant="info" role="status">
                                {t("konvertert")}
                            </InlineStatusMessage>
                        )}
                        {showSlowProcessingWarning && (
                            <InlineStatusMessage variant="info" role="status">
                                {t("processingWarning")}
                            </InlineStatusMessage>
                        )}
                        {(docState.validations?.length ?? 0) > 0 && (
                            <>
                                {docState.validations?.map((error) => (
                                    <InlineStatusMessage key={error} variant="error" role="alert">
                                        {t(`submissionError.${error}`)}
                                    </InlineStatusMessage>
                                ))}
                            </>
                        )}
                        <VStack as="ul" gap="space-8">
                            {docState.uploads?.map((upload) => {
                                let deleteButtonEl: HTMLButtonElement | null = null;
                                return (
                                    <FileUploadItem
                                        key={upload.id}
                                        url={
                                            upload.url
                                                ? `${browserEnv.NEXT_PUBLIC_BASE_PATH}/api/upload-api${upload.url}`
                                                : undefined
                                        }
                                        isConverted={upload.converted}
                                        convertedFilename={upload.finalFilename}
                                        originalFilename={upload.originalFilename}
                                        validations={upload.validations}
                                        status={upload.status}
                                        size={upload.size}
                                        showCancelButton={
                                            showSlowProcessingWarning &&
                                            (upload.status === "PENDING" || upload.status === "PROCESSING")
                                        }
                                        deleteDisabled={isPending}
                                        buttonRef={(el) => {
                                            deleteButtonEl = el;
                                        }}
                                        onDelete={() =>
                                            terminateUpload(upload.id, upload.correlationId, () => {
                                                // Bare flytt fokus hvis brukeren fortsatt står på denne knappen.
                                                if (document.activeElement === deleteButtonEl) {
                                                    focusAnchorRef.current?.focus();
                                                }
                                            })
                                        }
                                    />
                                );
                            })}
                        </VStack>
                    </VStack>
                )}
            </VStack>
        </FileUpload>
    );
};

export default FileSelectNew;
