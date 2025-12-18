import { logger } from "@navikt/next-logger";

import { getServerEnv } from "@config/env";

export const getDriftsmeldinger = async () => {
    const driftsmeldingerurl = getServerEnv().DRIFTSMELDINGER_URL;
    if (!driftsmeldingerurl) return [];

    const driftsmeldingUrl = new URL(`${driftsmeldingerurl}/status`);
    driftsmeldingUrl.searchParams.set(DriftsmeldingAudienceParam, DriftsmeldingAudience.innsyn);

    try {
        const res = await fetch(driftsmeldingUrl.toString(), {
            signal: AbortSignal.timeout(500),
        });
        if (!res.ok) {
            logger.warn(`fetching driftsmeldinger: HTTP error response: ${res.status} ${res.statusText}`);
            return [];
        }
        return (await res.json()) as Driftsmelding[];
    } catch (e: unknown) {
        logger.warn(`fetching driftsmeldinger: ${e}`);
        return [];
    }
};

export const DriftsmeldingAudience = {
    soknad: "soknad",
    innsyn: "innsyn",
    modia: "modia",
} as const;

export const DriftsmeldingAudienceParam = "audience";

/**
 * Hvordan driftsmeldingen skal vises; samsvarer med Aksel sin Alert-komponent
 */
export type Severity = (typeof Severity)[keyof typeof Severity];

export const Severity = {
    info: "info",
    success: "success",
    error: "error",
    warning: "warning",
} as const;

export interface Driftsmelding {
    createdAt: string;
    /** Driftsmeldingen utløper (blir usynlig) etter dato */
    expiresAt?: string;
    id: number;
    /** Driftsmeldingen blir først synlig etter dato */
    publishedAt?: string;
    severity: Severity;
    /** Teksten som skal vises i driftsmeldingen, i Markdown-format */
    text: string;
    /** Driftsmeldingen skal vises i innsyn */
    visibleInInnsyn: boolean;
    /** Driftsmeldingen skal vises i modia */
    visibleInModia: boolean;
    /** Driftsmeldingen skal vises i søknad */
    visibleInSoknad: boolean;
}
