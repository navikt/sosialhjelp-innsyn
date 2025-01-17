import { i18n } from "i18next";
import { set } from "date-fns";

const hentUtbetalingTittel = (tittel: string, defaultTittel: string) => {
    return tittel && tittel !== "default_utbetalinger_tittel" ? tittel : defaultTittel;
};

const hentTekstForUtbetalingsmetode = (utbetalingsmetode: string, i18n: i18n) => {
    return i18n.exists(`utbetalingsmetode.${utbetalingsmetode.toLowerCase()}`)
        ? i18n.t(`utbetalingsmetode.${utbetalingsmetode.toLowerCase()}`)
        : utbetalingsmetode;
};

const hentMaanedString = (maaned: number, i18n: i18n) => {
    return set(new Date(0), { month: maaned - 1 }).toLocaleString(i18n.language, { month: "long" });
};

export { hentUtbetalingTittel, hentMaanedString, hentTekstForUtbetalingsmetode };
