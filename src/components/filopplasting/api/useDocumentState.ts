import { useEffect, useReducer } from "react";
import { eventstreamUrl, openEventChannel } from "@components/filopplasting/api/openEventChannel";
import { useParams } from "next/navigation";

export type UploadStatus = "PROCESSING" | "FAILED" | "COMPLETE" | "PENDING";

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

export type OptimisticUpload = {
    kind: "optimistic";
    clientId: string;
    originalFilename: string;
    size?: number;
    status: "PENDING";
};

export type ConfirmedUpload = {
    kind: "confirmed";
    clientId?: string;
    id: string;
    originalFilename: string;
    finalFilename?: string;
    filId?: string;
    validations?: ValidationCode[];
    url?: string;
    status: UploadStatus;
    size?: number;
};

export type UploadState = OptimisticUpload | ConfirmedUpload;

export type DocumentState = {
    submissionId?: string;
    error?: string;
    uploads?: UploadState[];
    validations?: ValidationCode[];
};

export type DocumentStateUpdate =
    | { type: "update"; newState: Partial<Omit<DocumentState, "uploads">> & { uploads?: ConfirmedUpload[] } }
    | { type: "clear" }
    | { type: "addOptimistic"; upload: OptimisticUpload }
    | { type: "confirmUpload"; clientId: string; tusId: string }
    | { type: "remove"; clientId: string };

const mergeUploads = (existing: UploadState[] = [], incoming: ConfirmedUpload[] = []): UploadState[] => {
    const incomingIds = new Set(incoming.map((u) => u.id));
    const optimistic = existing.filter((u): u is OptimisticUpload => u.kind === "optimistic");
    const confirmedById = new Map(
        existing.filter((u): u is ConfirmedUpload => u.kind === "confirmed").map((u) => [u.id, u])
    );
    const incomingMerged = incoming.map((u) => {
        const existing = confirmedById.get(u.id);
        // Drop clientId once SSE has seen the entry — it's now fully server-owned
        return { ...existing, clientId: undefined, ...u, kind: "confirmed" as const };
    });
    // Keep confirmed entries promoted from optimistic that SSE hasn't caught up with yet
    const promotedNotYetIncoming = existing.filter(
        (u): u is ConfirmedUpload => u.kind === "confirmed" && !!u.clientId && !incomingIds.has(u.id)
    );
    return [...optimistic, ...promotedNotYetIncoming, ...incomingMerged];
};

const documentStateReducer = (state: DocumentState, payload: DocumentStateUpdate): DocumentState => {
    const { type } = payload;
    if (type === "update") {
        const { newState } = payload;
        if (state.submissionId && state.submissionId !== newState.submissionId) {
            return { ...newState, uploads: mergeUploads([], newState.uploads) };
        }
        return { ...state, ...newState, uploads: mergeUploads(state.uploads, newState.uploads) };
    }
    if (type === "clear") {
        return { ...state, error: undefined, uploads: [], validations: [] };
    }
    if (type === "addOptimistic") {
        if (state.uploads?.some((u) => u.kind === "optimistic" && u.clientId === payload.upload.clientId)) {
            return state;
        }
        return { ...state, uploads: [...(state.uploads ?? []), payload.upload] };
    }
    if (type === "confirmUpload") {
        const optimistic = state.uploads?.find(
            (u): u is OptimisticUpload => u.kind === "optimistic" && u.clientId === payload.clientId
        );
        const alreadyConfirmed = state.uploads?.some((u) => u.kind === "confirmed" && u.id === payload.tusId);
        const withoutOptimistic =
            state.uploads?.filter((u) => !(u.kind === "optimistic" && u.clientId === payload.clientId)) ?? [];
        if (alreadyConfirmed || !optimistic) {
            return { ...state, uploads: withoutOptimistic };
        }
        const confirmed: ConfirmedUpload = {
            kind: "confirmed",
            clientId: payload.clientId,
            id: payload.tusId,
            originalFilename: optimistic.originalFilename,
            size: optimistic.size,
            status: "PENDING",
        };
        return { ...state, uploads: [...withoutOptimistic, confirmed] };
    }
    if (type === "remove") {
        return {
            ...state,
            uploads: state.uploads?.filter((u) => !(u.kind === "optimistic" && u.clientId === payload.clientId)),
        };
    }
    throw new Error("Unsupported type");
};

export const useDocumentState = (
    id: string
): {
    state: DocumentState;
    resetState: () => void;
    addOptimistic: (upload: OptimisticUpload) => void;
    confirmUpload: (clientId: string, tusId: string) => void;
    removeUpload: (clientId: string) => void;
} => {
    const [state, dispatch] = useReducer(documentStateReducer, {});
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    const resetState = () => dispatch({ type: "clear" });

    const onUpdate = (payload: Partial<DocumentState>) => {
        if (payload.error === "forbidden") {
            return dispatch({ type: "clear" });
        }
        const { uploads, ...rest } = payload;
        dispatch({
            type: "update",
            newState: { ...rest, uploads: uploads as ConfirmedUpload[] | undefined },
        });
    };
    useEffect(() => {
        return openEventChannel(eventstreamUrl(id, fiksDigisosId), onUpdate);
    }, [id, fiksDigisosId]);

    const addOptimistic = (upload: OptimisticUpload) => dispatch({ type: "addOptimistic", upload });
    const confirmUpload = (clientId: string, tusId: string) => dispatch({ type: "confirmUpload", clientId, tusId });
    const removeUpload = (clientId: string) => dispatch({ type: "remove", clientId });

    return { state, resetState, addOptimistic, confirmUpload, removeUpload };
};
