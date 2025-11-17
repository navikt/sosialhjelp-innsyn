import { hentNyeUtbetalinger } from "@generated/ssr/utbetalinger-controller/utbetalinger-controller";

import { erKommendeGrouped } from "./kommende";

export const getKommendeUtbetalinger = async () => {
    const nye = await hentNyeUtbetalinger();
    return nye
        .map((gruppe) => ({
            ...gruppe,
            utbetalingerForManed: gruppe.utbetalingerForManed.filter(erKommendeGrouped),
        }))
        .filter((gruppe) => gruppe.utbetalingerForManed.length > 0);
};
