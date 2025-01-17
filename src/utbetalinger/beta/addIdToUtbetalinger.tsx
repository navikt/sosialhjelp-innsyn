import { NyeOgTidligereUtbetalingerResponse } from "../../generated/model";

import { UtbetalingMedId } from "./UtbetalingerPanelBeta";

const leggIdPaaUtbetalingerForManed = (item: NyeOgTidligereUtbetalingerResponse): UtbetalingMedId[] =>
    item.utbetalingerForManed.map((utbetaling) => ({
        ...utbetaling,
        id: crypto.randomUUID(),
    }));
// Legg på en id på hver utbetaling
export const addIdToUtbetalinger = (data: NyeOgTidligereUtbetalingerResponse[]) =>
    data.map((item) => ({
        ...item,
        utbetalingerForManed: leggIdPaaUtbetalingerForManed(item),
    }));
