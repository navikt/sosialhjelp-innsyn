import { logAnalyticsCustomEvent } from "@navikt/nav-dekoratoren-moduler";

/**
 * Logger custom events som ikke har en standardtype i @navikt/analytics-types.
 * Bruk logAnalyticsEvent() med Events fra @navikt/nav-dekoratoren-moduler der det finnes en passende type.
 */
export function umamiCustomTrack(eventName: string, data?: Record<string, unknown>) {
    return logAnalyticsCustomEvent({ eventName, origin: "sosialhjelp-innsyn", eventData: data });
}
