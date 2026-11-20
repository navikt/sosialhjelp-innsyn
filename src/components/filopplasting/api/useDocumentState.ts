import { useCallback, useEffect, useReducer } from "react";
import { fetchSubmissionStatus, type SubmissionState } from "./fetchSubmissionStatus";
import { eventstreamUrl, openEventChannel } from "@components/filopplasting/api/openEventChannel";
import { useParams } from "next/navigation";

export type UploadStatus = "PROCESSING" | "FAILED" | "COMPLETE" | "PENDING" | "RETRYABLE_FAILED";

export type UploadMode = "tus" | "sync";

export type UploadState = {
    originalFilename: string;
    finalFilename?: string;
    id: string;
    // Finished upload mellomlager-id
    filId?: string;
    validations?: ValidationCode[];
    url?: string;
    status: UploadStatus;
    size?: number;
    correlationId?: string;
    converted: boolean;
};

export enum ValidationCode {
    FILE_TOO_LARGE = "FILE_TOO_LARGE",
    INVALID_FILENAME = "INVALID_FILENAME",
    POSSIBLY_INFECTED = "POSSIBLY_INFECTED",
    FILETYPE_NOT_SUPPORTED = "FILETYPE_NOT_SUPPORTED",
    ENCRYPTED_PDF = "ENCRYPTED_PDF",
    INVALID_PDF = "INVALID_PDF",
    TOO_MANY_FILES = "TOO_MANY_FILES",
    TOTAL_TOO_LARGE = "TOTAL_TOO_LARGE",
}

export type DocumentState = {
    submissionId?: string;
    error?: string;
    uploads?: UploadState[];
    validations?: ValidationCode[];
};

export type DocumentStateUpdate =
    | {
          type: "update";
          newState: Partial<DocumentState>;
      }
    | { type: "clear" }
    | { type: "addUploads"; uploads: UploadState[] }
    | { type: "removeUpload"; correlationId: string }
    | { type: "uploadResult"; correlationId: string; upload: UploadState; submissionId?: string }
    | { type: "refresh"; state: SubmissionState };

export const documentStateReducer = (state: DocumentState, payload: DocumentStateUpdate): DocumentState => {
    const { type } = payload;
    if (type === "update") {
        const { newState } = payload;
        if (state.submissionId && state.submissionId !== newState.submissionId) {
            return newState;
        }

        const incoming = newState.uploads ?? [];
        const existing = state.uploads ?? [];

        // Update existing entries in place, matching by correlationId or id
        const updated = existing.map((existingUpload) => {
            const match = incoming.find(
                (u) =>
                    (u.correlationId && u.correlationId === existingUpload.correlationId) || u.id === existingUpload.id
            );
            return match ?? existingUpload;
        });

        // Append genuinely new uploads from SSE (no match by correlationId or id)
        const existingIds = new Set(existing.map((u) => u.id));
        const existingCorrelationIds = new Set(existing.map((u) => u.correlationId).filter(Boolean));
        const newFromSse = incoming.filter(
            (u) => !existingIds.has(u.id) && (!u.correlationId || !existingCorrelationIds.has(u.correlationId))
        );

        return {
            ...state,
            ...newState,
            uploads: [...updated, ...newFromSse],
        };
    }
    if (type === "clear") {
        return { ...state, error: undefined, uploads: [], validations: [] };
    }
    if (type === "addUploads") {
        return {
            ...state,
            uploads: [...(state.uploads ?? []), ...payload.uploads],
        };
    }
    if (type === "removeUpload") {
        return {
            ...state,
            uploads: (state.uploads ?? []).filter((u) => u.correlationId !== payload.correlationId),
        };
    }
    if (type === "uploadResult") {
        const { correlationId, upload, submissionId } = payload;
        const existing = state.uploads ?? [];
        return {
            ...state,
            submissionId: submissionId || state.submissionId,
            uploads: existing.map((u) => (u.correlationId === correlationId ? upload : u)),
        };
    }
    if (type === "refresh") {
        const { state: server } = payload;
        const serverUploads = server.uploads ?? [];
        // Behold kun klientside-rader (uten filId) som serveren ikke kjenner til.
        const clientOnly = (state.uploads ?? []).filter(
            (u) =>
                !u.filId &&
                !serverUploads.some((s) => s.id === u.id || (!!s.correlationId && s.correlationId === u.correlationId))
        );
        return {
            ...state,
            submissionId: server.submissionId || state.submissionId,
            error: server.error,
            validations: server.validations ?? [],
            uploads: [...serverUploads, ...clientOnly],
        };
    }
    throw new Error("Unsupported type");
};

export const useDocumentState = (
    id: string,
    { mode = "tus" }: { mode?: UploadMode } = {}
): {
    state: DocumentState;
    resetState: () => void;
    addUploads: (uploads: UploadState[]) => void;
    removeUpload: (correlationId: string) => void;
    hasFiles: boolean;
    allValidated: boolean;
    allFilesUploaded: boolean;
    hasFormErrors: boolean;
    canSubmit: boolean;
    pendingRequests: number;
    uploadResult: (correlationId: string, upload: UploadState, submissionId?: string) => void;
    refresh: () => Promise<void>;
} => {
    const [state, dispatch] = useReducer(documentStateReducer, {});
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    const resetState = () => dispatch({ type: "clear" });
    const addUploads = (uploads: UploadState[]) => dispatch({ type: "addUploads", uploads });
    const removeUpload = (correlationId: string) => dispatch({ type: "removeUpload", correlationId });

    // Subscribe to server-sent events and send any state updates to the reducer
    const onUpdate = (payload: Partial<DocumentState>) => {
        if (payload.error === "forbidden") {
            return dispatch({ type: "clear" });
        }
        dispatch({ type: "update", newState: payload });
    };
    useEffect(() => {
        if (mode === "sync") return;
        return openEventChannel(eventstreamUrl(id, fiksDigisosId), onUpdate);
    }, [id, fiksDigisosId, mode]);

    const uploadResult = (correlationId: string, upload: UploadState, submissionId?: string) =>
        dispatch({ type: "uploadResult", correlationId, upload, submissionId });

    const refresh = useCallback(async () => {
        try {
            const result = await fetchSubmissionStatus(id);
            if (result.kind === "forbidden") return dispatch({ type: "clear" });
            dispatch({ type: "refresh", state: result.state });
        } catch {
            // Status hentes på nytt ved neste handling; ingen logging av innhold.
        }
    }, [id]);

    useEffect(() => {
        if (mode === "sync") void refresh();
    }, [mode, refresh]);

    const uploads = state.uploads ?? [];
    const hasFiles = uploads.length > 0;
    const allValidated = uploads.every((upload) => !upload.validations?.length);
    const allFilesUploaded = uploads.every((upload) => !!upload.filId);
    const hasFormErrors = !!state.validations?.length;
    const pendingRequests = uploads.filter((upload) => upload.status === "PENDING" && !upload.filId).length;
    const canSubmit =
        !!state.submissionId && pendingRequests === 0 && hasFiles && allValidated && allFilesUploaded && !hasFormErrors;

    return {
        state,
        resetState,
        addUploads,
        removeUpload,
        hasFiles,
        allValidated,
        allFilesUploaded,
        hasFormErrors,
        canSubmit,
        pendingRequests,
        uploadResult,
        refresh,
    };
};
