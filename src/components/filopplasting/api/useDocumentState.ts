import { useEffect, useReducer } from "react";
import { eventstreamUrl, openEventChannel } from "@components/filopplasting/api/openEventChannel";
import { useParams } from "next/navigation";

export type UploadStatus = "PROCESSING" | "FAILED" | "COMPLETE" | "PENDING" | "DELETING";

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
    | { type: "markAsDeleting"; correlationId: string };

const documentStateReducer = (state: DocumentState, payload: DocumentStateUpdate): DocumentState => {
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
    if (type === "markAsDeleting") {
        // Setter status til DELETING uten å fjerne filen fra listen.
        // Dette holder <li>-elementet i DOM slik at VoiceOver ikke mister fokus
        // og rekker å lese opp slette-kunngjøringen før elementet forsvinner.
        return {
            ...state,
            uploads: (state.uploads ?? []).map((u) =>
                u.correlationId === payload.correlationId ? { ...u, status: "DELETING" as const } : u
            ),
        };
    }
    throw new Error("Unsupported type");
};

export const useDocumentState = (
    id: string
): {
    state: DocumentState;
    resetState: () => void;
    addUploads: (uploads: UploadState[]) => void;
    removeUpload: (correlationId: string) => void;
    markAsDeleting: (correlationId: string) => void;
} => {
    const [state, dispatch] = useReducer(documentStateReducer, {});
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    const resetState = () => dispatch({ type: "clear" });
    const addUploads = (uploads: UploadState[]) => dispatch({ type: "addUploads", uploads });
    const removeUpload = (correlationId: string) => dispatch({ type: "removeUpload", correlationId });
    const markAsDeleting = (correlationId: string) => dispatch({ type: "markAsDeleting", correlationId });

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

    return { state, resetState, addUploads, removeUpload, markAsDeleting };
};
