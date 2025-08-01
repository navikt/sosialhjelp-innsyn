import { logger } from "@navikt/next-logger";

import { getServerEnv } from "@config/env";
import exchangedFetch from "@api/ssr/exchangedFetch";

export interface PaabegyntSoknad {
    eventTidspunkt: string;
    eventId: string;
    grupperingsId: string;
    tekst: string;
    link: string;
    sikkerhetsnivaa: number;
    sistOppdatert: string;
    isAktiv: boolean;
    soknadId: string;
}

const fetchPaabegynteSaker = async (): Promise<PaabegyntSoknad[]> => {
    if (getServerEnv().NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local") {
        return Promise.resolve([]);
    }
    try {
        return exchangedFetch<PaabegyntSoknad[]>(
            "/dittnav/pabegynte/aktive",
            getServerEnv().SOKNAD_API_HOSTNAME,
            "/sosialhjelp/soknad-api"
        );
    } catch (e: unknown) {
        logger.error(`Feil ved henting av paabegynte saker ${e}`);
        return Promise.resolve([]);
    }
};

export default fetchPaabegynteSaker;
