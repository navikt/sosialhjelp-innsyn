import { logger } from "@navikt/next-logger";

import { hentAlleSaker } from "@generated/ssr/saks-oversikt-controller/saks-oversikt-controller";

const fetchAlleSoknader = async () => {
    try {
        return await hentAlleSaker({ cache: "force-cache" });
    } catch (e: unknown) {
        logger.error(`Fikk feil under henting av alle saker. Feil: ${e}`);
        return [];
    }
};

export default fetchAlleSoknader;
