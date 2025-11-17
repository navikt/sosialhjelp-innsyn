import { startOfToday, isAfter, isEqual } from "date-fns";

import { ManedUtbetaling, ManedUtbetalingStatus } from "@generated/ssr/model";

export const erKommendeGrouped = (utbetaling: ManedUtbetaling) => {
    if (!utbetaling.forfallsdato) return false;
    const date = new Date(utbetaling.forfallsdato);
    const today = startOfToday();
    const onOrAfterToday = isAfter(date, today) || isEqual(date, today);

    const allowed =
        utbetaling.status === ManedUtbetalingStatus.PLANLAGT_UTBETALING ||
        utbetaling.status === ManedUtbetalingStatus.STOPPET;

    return allowed && onOrAfterToday;
};
