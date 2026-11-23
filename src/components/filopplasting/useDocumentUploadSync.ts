import { FileObject } from "@navikt/ds-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isFolder } from "./utils/validateFiles";
import * as R from "remeda";
import { UploadState, ValidationCode } from "./api/useDocumentState";
import { useRef, useState } from "react";
import { uploadFile } from "./api/uploadFile";
import { deleteFile } from "./api/deleteFile";
import { targetMetadata, type UploadTarget } from "./utils/tusUploader";

export type UploadResultHandler = (correlationId: string, upload: Partial<UploadState>, submissionId?: string) => void;

type UploadVariables = { correlationId: string; file: File };

const syncUploadKey = (contextId: string) => ["sync-upload", contextId] as const;

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
    const queryClient = useQueryClient();
    const mutationKey = syncUploadKey(contextId);
    // Rader slettet mens forespørselen var underveis: resultatet skal slettes, ikke rapporteres.
    const cancelled = useRef(new Set<string>());

    // Filen til «prøv igjen» ligger i variables og forsvinner etter gcTime (5 min).
    const { mutate } = useMutation({
        mutationKey,
        mutationFn: ({ correlationId, file }: UploadVariables) =>
            uploadFile({ file, contextId, correlationId, targetFields: targetMetadata(target) }),
        onSuccess: async (result, { correlationId }) => {
            if (cancelled.current.delete(correlationId)) {
                if (result.kind === "stored") await deleteFile(result.upload.id).catch(() => undefined);
                return;
            }
            switch (result.kind) {
                case "stored":
                    onUploadResult(correlationId, result.upload, result.submissionId);
                    break;
                case "rejected":
                    onUploadResult(correlationId, { status: "FAILED", validations: result.validations });
                    break;
                case "tooLarge":
                    onUploadResult(correlationId, { status: "FAILED", validations: [ValidationCode.FILE_TOO_LARGE] });
                    break;
                case "invalid":
                    onUploadResult(correlationId, { status: "FAILED" });
                    break;
                case "forbidden":
                    onForbidden?.();
                    break;
                case "failed":
                    onUploadResult(correlationId, { status: "RETRYABLE_FAILED" });
                    break;
            }
        },
        onError: (_error, { correlationId }) => {
            if (cancelled.current.delete(correlationId)) {
                return;
            }
            onUploadResult(correlationId, { status: "RETRYABLE_FAILED" });
        },
    });

    const startUpload = (selected: FileObject[]): number => {
        const [folders, validFiles] = R.partition(selected, (f) => isFolder(f));
        setFolderDropError(folders.length > 0);
        if (validFiles.length === 0) return 0;

        onSelect?.(validFiles);

        const uploads = validFiles.map(({ file }) => ({ correlationId: crypto.randomUUID(), file }));
        onUploadsAdded(
            uploads.map(
                ({ correlationId, file }) =>
                    ({
                        id: correlationId,
                        correlationId,
                        converted: false,
                        originalFilename: file.name,
                        size: file.size,
                        status: "PENDING" as const,
                    }) satisfies UploadState
            )
        );
        uploads.forEach((upload) => mutate(upload));
        return validFiles.length;
    };

    // «Prøv igjen» vises bare for RETRYABLE_FAILED, og status settes til PENDING her, så dobbeltklikk er ikke mulig.
    const retryUpload = (correlationId: string) => {
        const variables = queryClient.getMutationCache().find<unknown, Error, UploadVariables>({
            mutationKey,
            predicate: (m) => (m.state.variables as UploadVariables | undefined)?.correlationId === correlationId,
        })?.state.variables;
        if (!variables) {
            // Mutasjonen er garbage-collected: filen finnes ikke lenger, så brukeren må velge den på nytt.
            onUploadResult(correlationId, { status: "FAILED" });
            return;
        }
        onUploadResult(correlationId, { status: "PENDING" });
        mutate(variables);
    };

    // beforeRemove kjøres før raden fjernes, mens slett-knappen fortsatt finnes.
    const terminateUpload = async (uploadId: string, correlationId?: string, beforeRemove?: () => void) => {
        const isPlaceholder = !!correlationId && uploadId === correlationId;
        if (isPlaceholder) {
            // Hvis forespørselen er underveis, sletter onSuccess resultatet når den er ferdig.
            cancelled.current.add(correlationId);
        } else {
            try {
                await deleteFile(uploadId);
            } catch {
                // Raden beholdes slik at brukeren kan prøve igjen.
                return;
            }
        }
        beforeRemove?.();
        if (correlationId) onUploadRemoved(correlationId);
    };

    return { startUpload, terminateUpload, retryUpload, folderDropError };
};
