import { i18n } from "i18next";

const hentUtbetalingTittel = (tittel: string, defaultTittel: string) => {
    return tittel && tittel !== "default_utbetalinger_tittel" ? tittel : defaultTittel;
};

const hentTekstForUtbetalingsmetode = (utbetalingsmetode: string, i18n: i18n) => {
    return i18n.exists(`utbetalingsmetode.${utbetalingsmetode.toLowerCase()}`)
        ? i18n.t(`utbetalingsmetode.${utbetalingsmetode.toLowerCase()}`)
        : utbetalingsmetode;
};

const hentMaanedString = (maaned: number, i18n: i18n) => {
    const date = new Date();
    date.setMonth(maaned - 1);
    return date.toLocaleString(i18n.language, { month: "long" });
};

export { hentUtbetalingTittel, hentMaanedString, hentTekstForUtbetalingsmetode };
