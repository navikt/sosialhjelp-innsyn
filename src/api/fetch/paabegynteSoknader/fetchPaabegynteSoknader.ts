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
    try {
        return await exchangedFetch<PaabegyntSoknad[]>(
            "/dittnav/pabegynte/aktive",
            getServerEnv().SOKNAD_API_HOSTNAME,
            "/sosialhjelp/soknad-api",
            getServerEnv().SOKNAD_API_PORT
        );
    } catch (e: unknown) {
        logger.error(`Feil ved henting av paabegynte saker ${e}`);
        return [];
    }
};

export default fetchPaabegynteSaker;
