import { useEffect, useReducer } from "react";
import { eventstreamUrl, openEventChannel } from "@components/filopplasting/new/api/openEventChannel";

import { logger } from "@navikt/next-logger";

export type UploadState = {
    originalFilename: string;
    convertedFilename?: string;
    id: string;
    pages: {
        thumbnail?: string;
        pageNumber: number;
    }[];
};

export type DocumentState = {
    documentId?: string;
    error?: string;
    uploads?: UploadState[];
};

export type DocumentStateUpdate = {
    type: "update";
    newState: Partial<DocumentState>;
};

const documentStateReducer = (state: DocumentState, { newState, type }: DocumentStateUpdate) => {
    if (type == "update") {
        if (state.documentId && state.documentId !== newState.documentId) {
            logger.error("documentId has changed");
        }

        return { ...state, ...newState };
    }
    return newState;
};

export const useDocumentState = (id: string): DocumentState => {
    const [state, dispatch] = useReducer(documentStateReducer, {});

    // Subscribe to server-sent events and send any state updates to the reducer
    const onUpdate = (payload: Partial<DocumentState>) => dispatch({ type: "update", newState: payload });
    useEffect(() => {
        console.log("opening channel for", id);
        return openEventChannel(eventstreamUrl(id), onUpdate);
    }, [id]);

    return state;
};
