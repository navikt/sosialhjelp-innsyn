import { useEffect, useReducer } from "react";
import { logger } from "@navikt/next-logger";
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
};

export enum ValidationCode {
    FILE_TOO_LARGE = "FILE_TOO_LARGE",
    INVALID_FILENAME = "INVALID_FILENAME",
    POSSIBLY_INFECTED = "POSSIBLY_INFECTED",
    FILETYPE_NOT_SUPPORTED = "FILETYPE_NOT_SUPPORTED",
    ENCRYPTED_PDF = "ENCRYPTED_PDF",
    INVALID_PDF = "INVALID_PDF",
}

export type DocumentState = {
    submissionId?: string;
    error?: string;
    uploads?: UploadState[];
};

export type DocumentStateUpdate = {
    type: "update";
    newState: Partial<DocumentState>;
};

const documentStateReducer = (state: DocumentState, { newState, type }: DocumentStateUpdate) => {
    if (type == "update") {
        if (state.submissionId && state.submissionId !== newState.submissionId) {
            logger.error("submissionId has changed");
        }

        return { ...state, ...newState };
    }
    return newState;
};

export const useDocumentState = (id: string): DocumentState => {
    const [state, dispatch] = useReducer(documentStateReducer, {});
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    // Subscribe to server-sent events and send any state updates to the reducer
    const onUpdate = (payload: Partial<DocumentState>) => dispatch({ type: "update", newState: payload });
    useEffect(() => {
        return openEventChannel(eventstreamUrl(id, fiksDigisosId), onUpdate);
    }, [id, fiksDigisosId]);

    return state;
};
