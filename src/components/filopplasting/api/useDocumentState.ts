import { useEffect, useReducer } from "react";
import { eventstreamUrl, openEventChannel } from "@components/filopplasting/api/openEventChannel";
import { useParams } from "next/navigation";

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
    | { type: "clear" };

const documentStateReducer = (state: DocumentState, payload: DocumentStateUpdate) => {
    const { type } = payload;
    if (type == "update") {
        const { newState } = payload;
        if (state.submissionId && state.submissionId !== newState.submissionId) {
            return newState;
        }

        return { ...state, ...newState };
    }
    if (type == "clear") {
        return { ...state, error: undefined, uploads: [], validations: [] };
    }
    throw new Error("Unsupported type");
};

export const useDocumentState = (id: string): { state: DocumentState; resetState: () => void } => {
    const [state, dispatch] = useReducer(documentStateReducer, {});
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    const resetState = () => dispatch({ type: "clear" });

    // Subscribe to server-sent events and send any state updates to the reducer
    const onUpdate = (payload: Partial<DocumentState>) => dispatch({ type: "update", newState: payload });
    useEffect(() => {
        return openEventChannel(eventstreamUrl(id, fiksDigisosId), onUpdate);
    }, [id, fiksDigisosId]);

    return { state, resetState };
};
