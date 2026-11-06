"use client";

import { useTranslations } from "next-intl";
import { FileObject, FileUpload, Heading, VStack } from "@navikt/ds-react";
import InlineStatusMessage from "@components/filopplasting/InlineStatusMessage";
import { ReactNode, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { DocumentState, UploadState } from "@components/filopplasting/api/useDocumentState";

import FileUploadItem from "./FileUploadItem";
import { FileSelectUpload } from "@components/filopplasting/FileSelectUpload";
import { browserEnv } from "@config/env";
import useSlowProcessingWarning from "@components/filopplasting/useSlowProcessingWarning";
import { useDocumentUpload } from "./useDocumentUpload";
import { UploadTarget } from "./utils/tusUploader";

// Venter til nettleseren har gitt fokus tilbake til «Velg filer» etter at filvelgeren lukkes.
const FILE_DIALOG_CLOSE_DELAY_MS = 300;

// Fokusflytting i stedet for aria-live: Firefox forkaster live-meldinger mens VoiceOver leser «Velg filer»,
// og like meldinger på rad hoppes over. Fokusflytting leses alltid.
type Announcement = { kind: "added"; count: number } | { kind: "deleted" };

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
    const statusId = useId();
    const listRef = useRef<HTMLUListElement>(null);
    const selectButtonContainerRef = useRef<HTMLDivElement>(null);
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const selectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const { startUpload, terminateUpload, folderDropError } = useDocumentUpload({
        contextId,
        onUploadRemoved,
        onUploadsAdded,
        onSelect,
        target,
    });

    const hasPendingOrProcessing = docState.uploads?.some((u) => u.status === "PENDING" || u.status === "PROCESSING");

    const showSlowProcessingWarning = useSlowProcessingWarning(hasPendingOrProcessing);

    const converted = docState.uploads?.some((upload) => upload.converted);
    const uploadCount = docState.uploads?.length ?? 0;

    const statusText =
        announcement?.kind === "added"
            ? t("filLagtTil", { count: announcement.count })
            : announcement?.kind === "deleted"
              ? t("filSlettet", { count: uploadCount })
              : undefined;

    // Utledes etter at raden er fjernet, slik at det blir riktig også ved samtidige slettinger.
    const lastDeletedMessage = announcement?.kind === "deleted" && uploadCount === 0 ? statusText : null;

    useEffect(() => () => clearTimeout(selectTimer.current), []);

    // Layout-effekt: fokus flyttes før nettleseren rekker å sende det til <body> når raden fjernes.
    useLayoutEffect(() => {
        if (!announcement) return;
        if (uploadCount > 0) {
            const list = listRef.current;
            // Allerede fokusert element gir ingen ny opplesing ved focus(), så blur først.
            if (list && document.activeElement === list) list.blur();
            list?.focus();
        }
        // Aksel eksponerer ikke ref til «Velg filer»-knappen, så vi finner den i containeren.
        else selectButtonContainerRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
        // Skal kun kjøre ved ny kunngjøring, ikke ved andre endringer i listen.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [announcement]);

    const handleSelect = (files: FileObject[]) => {
        const count = startUpload(files);
        if (count === 0) return;
        clearTimeout(selectTimer.current);
        selectTimer.current = setTimeout(() => {
            // Ikke ta fokus fra en bruker som har gått videre (f.eks. dra-og-slipp mens fokus er i et annet felt).
            const active = document.activeElement;
            const stillHere =
                !active ||
                active === document.body ||
                !!selectButtonContainerRef.current?.contains(active) ||
                !!listRef.current?.contains(active);
            if (stillHere) setAnnouncement({ kind: "added", count });
        }, FILE_DIALOG_CLOSE_DELAY_MS);
    };

    const handleDelete = (tusUploadId: string, correlationId: string | undefined, button: HTMLButtonElement) =>
        terminateUpload(tusUploadId, correlationId, () => {
            // Sjekkes etter slettingen: har brukeren gått videre, lar vi fokus være.
            if (document.activeElement === button) setAnnouncement({ kind: "deleted" });
        });

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
            <span id={statusId} hidden>
                {statusText}
            </span>
            <VStack gap="space-24">
                <div
                    ref={selectButtonContainerRef}
                    onBlur={() => setAnnouncement((a) => (a?.kind === "deleted" ? null : a))}
                >
                    <FileSelectUpload
                        label={label ?? t("tittel")}
                        headerId={`header-id-${contextId}`}
                        description={description}
                        tag={tag}
                        variant={variant === "warning" ? "warning" : "default"}
                        headingLevel={headingLevel}
                        buttonText={t("lastOppFiler")}
                        onSelect={(files) => {
                            if (!isPending) {
                                handleSelect(files);
                            }
                        }}
                        currentCount={docState.uploads?.length ?? 0}
                        disabled={isPending}
                        srMessage={lastDeletedMessage}
                    />
                </div>

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
                        <VStack
                            as="ul"
                            gap="space-8"
                            ref={listRef}
                            tabIndex={-1}
                            aria-labelledby={statusText ? statusId : undefined}
                        >
                            {docState.uploads?.map((upload) => (
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
                                    onDelete={(button) => handleDelete(upload.id, upload.correlationId, button)}
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
