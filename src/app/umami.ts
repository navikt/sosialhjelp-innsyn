import { logAnalyticsEvent } from "@navikt/nav-dekoratoren-moduler";

export function umamiTrack(eventName: string, data?: Record<string, unknown>) {
    return logAnalyticsEvent({ eventName, origin: "sosialhjelp-innsyn", eventData: data });
}
