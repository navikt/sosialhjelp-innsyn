import { logger } from "@navikt/next-logger";

import { getServerEnv } from "../../../config/env";
import exchangedFetch from "../../ssr/exchangedFetch";
import { PaabegyntSoknad } from "../../../components/aktiveSoknader/AktiveSoknader";

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
