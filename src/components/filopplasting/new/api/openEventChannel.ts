import { logger } from "@navikt/next-logger";
import { browserEnv } from "@config/env";
import { DocumentState } from "@components/filopplasting/new/api/useDocumentState";

export const eventstreamUrl = (id: string) => `${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/status/${id}` as const;

const isUpdateMessage = (payload: unknown): payload is DocumentState => {
    return typeof payload === "object" && payload !== null && !Object.hasOwn(payload, "heartbeat");
};

export const openEventChannel = (url: string, onUpdate: (payload: Partial<DocumentState>) => void) => {
    const eventSource = new EventSource(url);

    eventSource.onopen = (event) => {
        logger.info(`upload status channel opened: ${event}`);
    };

    eventSource.onmessage = (event) => {
        logger.info(`upload status channel message: ${event}`);
        try {
            const data = JSON.parse(event.data) as DocumentState;
            if (isUpdateMessage(data)) onUpdate(data);
        } catch (e) {
            logger.error(e);
        }
    };

    eventSource.onerror = (event) => {
        logger.warn(`upload status channel error: ${event}`);
    };
    return () => eventSource.close();
};
