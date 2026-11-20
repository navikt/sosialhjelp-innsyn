import { FileObject } from "@navikt/ds-react";
import { isFolder } from "./utils/validateFiles";
import * as R from "remeda";
import { UploadState, ValidationCode } from "./api/useDocumentState";
import { useEffect, useRef, useState } from "react";
import { uploadFile } from "./api/uploadFile";
import { deleteFile } from "./api/deleteFile";
import { targetMetadata, type UploadTarget } from "./utils/tusUploader";

const MAX_REQUESTS_IN_FLIGHT = 2;

export type UploadResultHandler = (correlationId: string, upload: UploadState, submissionId?: string) => void;

export const useDocumentUploadSync = ({
    contextId,
    onUploadRemoved,
    onUploadsAdded,
    onUploadResult,
    onForbidden,
    onSelect,
    target,
}: {
    contextId: string;
    onUploadRemoved: (correlationId: string) => void;
    onUploadsAdded: (uploads: UploadState[]) => void;
    onUploadResult: UploadResultHandler;
    onForbidden?: () => void;
    onSelect?: (files: FileObject[]) => void;
    target: UploadTarget;
}) => {
    const [folderDropError, setFolderDropError] = useState(false);
    const files = useRef(new Map<string, File>());
    const placeholders = useRef(new Map<string, UploadState>());
    const queue = useRef<string[]>([]);
    const inFlight = useRef(0);
    const active = useRef(new Set<string>());
    const removed = useRef(new Set<string>());
    const latest = useRef({ contextId, onUploadRemoved, onUploadResult, onForbidden, target });
    useEffect(() => {
        latest.current = { contextId, onUploadRemoved, onUploadResult, onForbidden, target };
    });

    const settle = (correlationId: string, upload: Partial<UploadState>) => {
        const placeholder = placeholders.current.get(correlationId);
        if (!placeholder) return;
        const next = { ...placeholder, ...upload };
        placeholders.current.set(correlationId, next);
        latest.current.onUploadResult(correlationId, next);
    };

    const run = async (correlationId: string) => {
        const file = files.current.get(correlationId);
        if (!file) return;
        const { contextId: ctx, target: tgt } = latest.current;
        inFlight.current++;
        active.current.add(correlationId);
        const result = await uploadFile({
            file,
            contextId: ctx,
            correlationId,
            targetFields: targetMetadata(tgt),
        });
        inFlight.current--;
        active.current.delete(correlationId);

        if (removed.current.has(correlationId)) {
            removed.current.delete(correlationId);
            files.current.delete(correlationId);
            placeholders.current.delete(correlationId);
            if (result.kind === "stored") await deleteFile(result.upload.id).catch(() => undefined);
        } else {
            switch (result.kind) {
                case "stored":
                    files.current.delete(correlationId);
                    placeholders.current.delete(correlationId);
                    latest.current.onUploadResult(correlationId, result.upload, result.submissionId);
                    break;
                case "rejected":
                    files.current.delete(correlationId);
                    settle(correlationId, { status: "FAILED", validations: result.validations });
                    break;
                case "tooLarge":
                    files.current.delete(correlationId);
                    settle(correlationId, { status: "FAILED", validations: [ValidationCode.FILE_TOO_LARGE] });
                    break;
                case "invalid":
                    files.current.delete(correlationId);
                    settle(correlationId, { status: "FAILED" });
                    break;
                case "forbidden":
                    files.current.clear();
                    placeholders.current.clear();
                    queue.current = [];
                    latest.current.onForbidden?.();
                    break;
                case "failed":
                    settle(correlationId, { status: "RETRYABLE_FAILED" });
                    break;
            }
        }
        pump();
    };

    const pump = () => {
        while (inFlight.current < MAX_REQUESTS_IN_FLIGHT && queue.current.length > 0) {
            void run(queue.current.shift()!);
        }
    };

    const startUpload = (selected: FileObject[]): number => {
        const [folders, validFiles] = R.partition(selected, (f) => isFolder(f));
        setFolderDropError(folders.length > 0);
        if (validFiles.length === 0) return 0;

        onSelect?.(validFiles);

        const optimisticUploads: UploadState[] = validFiles.map((file: FileObject) => {
            const correlationId = crypto.randomUUID();
            files.current.set(correlationId, file.file);
            queue.current.push(correlationId);
            const placeholder = {
                id: correlationId,
                correlationId,
                converted: false,
                originalFilename: file.file.name,
                size: file.file.size,
                status: "PENDING" as const,
            } satisfies UploadState;
            placeholders.current.set(correlationId, placeholder);
            return placeholder;
        });
        onUploadsAdded(optimisticUploads);
        pump();
        return validFiles.length;
    };

    const retryUpload = (correlationId: string) => {
        if (!files.current.has(correlationId) || queue.current.includes(correlationId)) return;
        settle(correlationId, { status: "PENDING" });
        queue.current.push(correlationId);
        pump();
    };

    // beforeRemove kjøres før raden fjernes, mens slett-knappen fortsatt finnes.
    const terminateUpload = async (uploadId: string, correlationId?: string, beforeRemove?: () => void) => {
        const isPlaceholder = !!correlationId && uploadId === correlationId;
        if (isPlaceholder) {
            if (active.current.has(correlationId)) {
                // Forespørselen er underveis: slett resultatet når den er ferdig.
                removed.current.add(correlationId);
            } else {
                files.current.delete(correlationId);
                placeholders.current.delete(correlationId);
                queue.current = queue.current.filter((c) => c !== correlationId);
            }
        } else {
            await deleteFile(uploadId);
        }
        beforeRemove?.();
        if (correlationId) latest.current.onUploadRemoved(correlationId);
    };

    return { startUpload, terminateUpload, retryUpload, folderDropError };
};
