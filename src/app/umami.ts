import { Events, logAnalyticsEvent } from "@navikt/nav-dekoratoren-moduler";
import type { EventName } from "@navikt/nav-dekoratoren-moduler";

export { Events };

export function umamiTrack(eventName: EventName, data?: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return logAnalyticsEvent({ eventName, origin: "sosialhjelp-innsyn", eventData: data as any });
}
