import { i18n } from "i18next";

const hentUtbetalingTittel = (tittel: string, defaultTittel: string) =>
    tittel && tittel !== "default_utbetalinger_tittel" ? tittel : defaultTittel;

const utbetalingsmetodeText = (utbetalingsmetode: string | undefined, i18n: i18n) => {
    if (!utbetalingsmetode) return null;
    return i18n.exists(`utbetalingsmetode.${utbetalingsmetode?.toLowerCase()}`)
        ? i18n.t(`utbetalingsmetode.${utbetalingsmetode?.toLowerCase()}`)
        : utbetalingsmetode;
};

export { hentUtbetalingTittel, utbetalingsmetodeText };
