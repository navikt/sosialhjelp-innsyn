import { hentUtbetalinger } from "@generated/ssr/utbetalinger-controller-2/utbetalinger-controller-2";
import { filtrerUtbetalinger, sorterUtbetalingerEtterDato } from "../../utbetalinger/_utils/utbetalinger-utils";

export const getKommendeUtbetalinger = async (limit = 12) => {
    const alleUtbetalinger = await hentUtbetalinger();
    const kommendeUtbetalinger = filtrerUtbetalinger("kommende", alleUtbetalinger);

    if (!kommendeUtbetalinger) return [];

    const sorterte = sorterUtbetalingerEtterDato(kommendeUtbetalinger);
    return sorterte.slice(0, limit);
};
