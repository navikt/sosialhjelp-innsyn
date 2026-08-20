"use client";

import { useTranslations } from "next-intl";
import * as R from "remeda";
import { FileObject, FileUpload, Heading, VStack } from "@navikt/ds-react";
import InlineStatusMessage from "@components/filopplasting/InlineStatusMessage";
import { ReactNode, useRef, useState } from "react";
import { getTusUploader } from "@components/filopplasting/utils/tusUploader";
import { DocumentState, UploadState } from "@components/filopplasting/api/useDocumentState";

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
    onUploadsAdded: (uploads: UploadState[]) => void;
    onUploadRemoved: (correlationId: string) => void;
    variant?: "normal" | "warning";
}

const liveRegionIndexes = [0, 1] as const;
type LiveRegionIndex = (typeof liveRegionIndexes)[number];

const FileSelectNew = ({
    label,
    description,
    tag,
    docState,
    id,
    filesLabel,
    uploadId,
    variant,
    onSelect,
    onUploadsAdded,
    onUploadRemoved,
    isPending,
}: Props) => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const t = useTranslations("Opplastingsboks");

    const hasPendingOrProcessing = docState.uploads?.some((u) => u.status === "PENDING" || u.status === "PROCESSING");

    const [folderDropError, setFolderDropError] = useState(false);
    const [fileWasDeleted, setFileWasDeleted] = useState(false);
    const [skjermleserBeskjed, setSkjermleserBeskjed] = useState<{ text: string; activeRegion: LiveRegionIndex }>({
        text: "",
        activeRegion: 0,
    });
    const announceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const showSlowProcessingWarning = useSlowProcessingWarning(hasPendingOrProcessing);

    // Bytter mellom to live-regioner med 200ms delay for å løse to separate problemer:
    // 1. Firefox + VoiceOver dropper live-region-mutasjoner rett etter native filvelger
    //    lukkes — delayen gir tid til fokusretur før live-regionen oppdateres.
    // 2. Identisk tekst leses ikke opp igjen — veksling mellom regionene sikrer at
    //    skjermleseren alltid ser en endring fra tom til tekst.
    const oppdaterSkjermleserBeskjed = (text: string, delay = 200) => {
        clearTimeout(announceTimerRef.current);
        announceTimerRef.current = setTimeout(() => {
            setSkjermleserBeskjed(({ activeRegion }) => ({
                text,
                activeRegion: activeRegion === 0 ? 1 : 0,
            }));
        }, delay);
    };

    // Starter opplasting umiddelbart ved filvalg
    const _onSelect = (files: FileObject[]) => {
        const [folders, valid] = R.partition(files, (f) => isFolder(f));

        setFolderDropError(folders.length > 0);

        if (valid.length === 0) return;
        setFileWasDeleted(false);
        oppdaterSkjermleserBeskjed(t("filLagtTil", { count: valid.length }));
        onSelect?.(valid);

        const optimisticUploads: UploadState[] = valid.map((file: FileObject) => {
            const correlationId = crypto.randomUUID();
            const upload = getTusUploader({
                id: uploadId,
                file,
                fiksDigisosId,
                correlationId,
            });
            upload.start();
            return {
                id: correlationId,
                correlationId,
                originalFilename: file.file.name,
                size: file.file.size,
                status: "PENDING" as const,
            };
        });
        onUploadsAdded(optimisticUploads);
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
            {liveRegionIndexes.map((index) => (
                <div key={index} role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                    {skjermleserBeskjed.activeRegion === index ? skjermleserBeskjed.text : ""}
                </div>
            ))}
            <div role="status" aria-live="polite" className="sr-only">
                {fileWasDeleted && t("filSlettet", { count: docState.uploads?.length ?? 0 })}
            </div>
            <VStack gap="space-24">
                <FileSelectUpload
                    label={label ?? t("tittel")}
                    headerId={`header-id-${uploadId}`}
                    description={description}
                    tag={tag}
                    variant={variant === "warning" ? "warning" : "default"}
                    buttonText={t("lastOppFiler")}
                    onSelect={_onSelect}
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
                                    deleteDisabled={isPending}
                                    onTerminate={() => {
                                        // Sett fileWasDeleted=true mens filen ennå er i docState —
                                        // live-regionen leser da riktig antall gjenværende filer.
                                        // Siden Button ikke lenger bruker loading-prop, setter
                                        // nettleseren ikke disabled på knappen automatisk, og
                                        // VoiceOver beholder fokuset mens kunngjøringen leses.
                                        setFileWasDeleted(true);
                                        setTimeout(() => {
                                            if (upload.correlationId) {
                                                onUploadRemoved(upload.correlationId);
                                            }
                                        }, 1500);
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

export default FileSelectNew;
