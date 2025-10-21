import { logger } from "@navikt/next-logger";

export function umamiTrack(name: string, data?: Record<string, unknown>) {
    if (typeof window === "undefined") return;
    try {
        window.umami?.track?.(name, data);
    } catch {
        logger.error("Umami tracking failed");
    }
}
