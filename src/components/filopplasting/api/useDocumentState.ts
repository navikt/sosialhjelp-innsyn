import { useEffect, useReducer } from "react";
import { eventstreamUrl, openEventChannel } from "@components/filopplasting/api/openEventChannel";
import { useParams } from "next/navigation";
import * as R from "remeda";

export type UploadStatus = "PROCESSING" | "FAILED" | "COMPLETE" | "PENDING";

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
    | { type: "addOptimistic"; upload: UploadState }
    | { type: "replaceId"; tempId: string; realId: string };

const mergeUploads = (existing: UploadState[] = [], incoming: UploadState[] = []): UploadState[] => {
    const incomingIds = new Set(incoming.map((u) => u.id));
    // Keep optimistic entries not yet acknowledged by the server
    const optimistic = existing.filter((u) => !incomingIds.has(u.id) && !u.filId && u.status === "PENDING");
    const incomingMerged = incoming.map((u) => ({ ...existing.find((e) => e.id === u.id), ...u }));
    return [...optimistic, ...incomingMerged];
};
const documentStateReducer = (state: DocumentState, payload: DocumentStateUpdate) => {
    const { type } = payload;
    if (type == "update") {
        const { newState } = payload;
        if (state.submissionId && state.submissionId !== newState.submissionId) {
            return newState;
        }

        return { ...state, ...newState, uploads: mergeUploads(state.uploads, newState.uploads) };
    }
    if (type == "clear") {
        return { ...state, error: undefined, uploads: [], validations: [] };
    }
    if (type == "addOptimistic") {
        if (state.uploads?.some((u) => u.id === payload.upload.id)) {
            return state;
        }
        return { ...state, uploads: [...(state.uploads ?? []), payload.upload] };
    }
    if (type == "replaceId") {
        const uploads = state.uploads?.map((u) => (u.id === payload.tempId ? { ...u, id: payload.realId } : u));
        // Drop duplicate if the real id already existed (e.g. SSE arrived before onUploadUrlAvailable)
        return { ...state, uploads: R.uniqueBy(uploads ?? [], (u) => u.id) };
    }
    throw new Error("Unsupported type");
};

export const useDocumentState = (
    id: string
): {
    state: DocumentState;
    resetState: () => void;
    addOptimistic: (upload: UploadState) => void;
    replaceId: (tempId: string, realId: string) => void;
} => {
    const [state, dispatch] = useReducer(documentStateReducer, {});
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    const resetState = () => dispatch({ type: "clear" });

    // Subscribe to server-sent events and send any state updates to the reducer
    const onUpdate = (payload: Partial<DocumentState>) => {
        if (payload.error === "forbidden") {
            return dispatch({ type: "clear" });
        }
        dispatch({ type: "update", newState: payload });
    };
    useEffect(() => {
        return openEventChannel(eventstreamUrl(id, fiksDigisosId), onUpdate);
    }, [id, fiksDigisosId]);

    const addOptimistic = (upload: UploadState) => dispatch({ type: "addOptimistic", upload });
    const replaceId = (tempId: string, realId: string) => dispatch({ type: "replaceId", tempId, realId });

    return { state, resetState, addOptimistic, replaceId };
};
