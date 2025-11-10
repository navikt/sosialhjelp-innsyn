import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/model";
import { hentNyeUtbetalinger } from "@generated/ssr/utbetalinger-controller/utbetalinger-controller";

const tillatteStatuserKommende = new Set<ManedUtbetalingStatus>([
    ManedUtbetalingStatus.PLANLAGT_UTBETALING,
    ManedUtbetalingStatus.STOPPET,
]);

export const getKommendeUtbetalinger = async (): Promise<NyeOgTidligereUtbetalingerResponse[]> => {
    const nye = await hentNyeUtbetalinger();

    return nye
        .map((gruppe) => ({
            ...gruppe,
            utbetalingerForManed: gruppe.utbetalingerForManed.filter(
                (utbetaling) =>
                    tillatteStatuserKommende.has(utbetaling.status) ||
                    (utbetaling.forfallsdato && new Date(utbetaling.forfallsdato) > new Date())
            ),
        }))
        .filter((gruppe) => gruppe.utbetalingerForManed.length > 0);
};
