"use client";

import { useTranslations } from "next-intl";
import * as R from "remeda";
import { BodyShort, FileObject, FileUpload, Heading, InlineMessage, VStack } from "@navikt/ds-react";
import { ReactNode, useState } from "react";
import { getTusUploader } from "@components/filopplasting/utils/tusUploader";
import { DocumentState } from "@components/filopplasting/api/useDocumentState";

import FileUploadItem from "./FileUploadItem";
import { FileSelectUpload } from "@components/filopplasting/FileSelectUpload";
import { browserEnv } from "@config/env";
import { useParams } from "next/navigation";
import useSlowProcessingWarning from "@components/filopplasting/useSlowProcessingWarning";
import { isFolder } from "@components/filopplasting/utils/validateFiles";

interface Props {
    id?: string;
    label?: string;
    description?: string;
    filesLabel?: string;
    tag?: ReactNode;
    isPending?: boolean;
    docState: DocumentState;
    uploadId: string;
    onSelect?: (files: FileObject[]) => void;
    variant?: "normal" | "warning";
}

const FileSelectNew = ({ label, description, tag, docState, id, filesLabel, uploadId, variant, onSelect }: Props) => {
    const t = useTranslations("Opplastingsboks");
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    const hasPendingOrProcessing = docState.uploads?.some((u) => u.status === "PENDING" || u.status === "PROCESSING");

    const [folderDropError, setFolderDropError] = useState(false);

    const showSlowProcessingWarning = useSlowProcessingWarning(hasPendingOrProcessing);

    // Starter opplasting umiddelbart ved filvalg
    const _onSelect = (files: FileObject[]) => {
        const [folders, valid] = R.partition(files, (f) => isFolder(f));

        setFolderDropError(folders.length > 0);

        if (valid.length === 0) return;
        onSelect?.(valid);
        const uploads = valid.map((file: FileObject) =>
            getTusUploader({
                id: uploadId,
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
                            <Heading
                                level="3"
                                size="small"
                                lang="no"
                                data-color={variant === "warning" ? "warning" : undefined}
                            >
                                {label}
                            </Heading>
                        ) : (
                            t("tittel")
                        )
                    }
                    tag={tag}
                    description={
                        description && variant === "warning" ? (
                            <BodyShort as="span" data-color="warning" lang="no">
                                {description}
                            </BodyShort>
                        ) : (
                            description
                        )
                    }
                    buttonText={t("lastOppFiler")}
                    onSelect={_onSelect}
                    currentCount={docState.uploads?.length ?? 0}
                    showLabelOnMobile={!!label}
                />

                {folderDropError && (
                    <InlineMessage
                        role="alert"
                        status="error"
                        className="bg-ax-bg-danger-moderate border border-ax-border-error-subtle p-2 rounded-xl text-ax-text-danger"
                    >
                        {t("mappeIkkeTillatt")}
                    </InlineMessage>
                )}

                {!!docState.uploads?.length && (
                    <VStack gap="space-8">
                        <Heading size="xsmall" level="3">
                            {filesLabel ?? t("valgteFiler", { antall_filer: docState.uploads.length })}
                        </Heading>
                        {converted && (
                            <InlineMessage
                                status={"info"}
                                role={"alert"}
                                className="border border-ax-border-info-subtle bg-ax-bg-info-moderate p-2 rounded-xl"
                            >
                                {t("konvertert")}
                            </InlineMessage>
                        )}
                        {showSlowProcessingWarning && (
                            <InlineMessage
                                status="info"
                                role="alert"
                                className="border border-ax-border-info-subtle bg-ax-bg-info-moderate p-2 rounded-xl"
                            >
                                {t("processingWarning")}
                            </InlineMessage>
                        )}
                        {(docState.validations?.length ?? 0) > 0 && (
                            <>
                                {docState.validations?.map((error) => (
                                    <InlineMessage
                                        key={`${error}`}
                                        status="error"
                                        role={"alert"}
                                        className="bg-ax-bg-danger-moderate border border-ax-border-error-subtle p-2 rounded-xl text-ax-text-danger"
                                    >
                                        {t(`submissionError.${error}`)}
                                    </InlineMessage>
                                ))}
                            </>
                        )}
                        <VStack as="ul" gap="space-8">
                            {docState.uploads?.map((upload) => (
                                <FileUploadItem
                                    key={upload.id}
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
                                    showCancelButton={
                                        showSlowProcessingWarning &&
                                        (upload.status === "PENDING" || upload.status === "PROCESSING")
                                    }
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
