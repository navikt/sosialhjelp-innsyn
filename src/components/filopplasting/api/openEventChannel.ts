import { logger } from "@navikt/next-logger";
import { browserEnv } from "@config/env";
import { DocumentState } from "@components/filopplasting/api/useDocumentState";

export const eventstreamUrl = (id: string) => `${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/status/${id}` as const;

const isUpdateMessage = (payload: unknown): payload is DocumentState => {
    return typeof payload === "object" && payload !== null && !Object.hasOwn(payload, "heartbeat");
};

const INITIAL_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 30000;

export const openEventChannel = (url: string, onUpdate: (payload: Partial<DocumentState>) => void) => {
    let eventSource: EventSource;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closed = false;
    let retryDelayMs = INITIAL_RETRY_DELAY_MS;

    const connect = () => {
        eventSource = new EventSource(url);

        eventSource.onopen = (event) => {
            logger.info(`upload status channel opened: ${event}`);
            retryDelayMs = INITIAL_RETRY_DELAY_MS;
        };

        eventSource.onmessage = (event) => {

            try {
                const data = JSON.parse(event.data) as DocumentState;
                if (isUpdateMessage(data)) onUpdate(data);
            } catch (e) {
                logger.error(e);
            }
        };

        eventSource.onerror = (event) => {
            logger.warn(`upload status channel error, reconnecting in ${retryDelayMs}ms: ${event}`);
            eventSource.close();
            if (!closed) {
                reconnectTimer = setTimeout(() => {
                    retryDelayMs = Math.min(retryDelayMs * 2, MAX_RETRY_DELAY_MS);
                    connect();
                }, retryDelayMs);
            }
        };
    };

    connect();

    return () => {
        closed = true;
        if (reconnectTimer !== null) clearTimeout(reconnectTimer);
        eventSource.close();
    };
};
