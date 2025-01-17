import { i18n } from "i18next";

const hentUtbetalingTittel = (tittel: string, defaultTittel: string) =>
    tittel && tittel !== "default_utbetalinger_tittel" ? tittel : defaultTittel;

const hentTekstForUtbetalingsmetode = (utbetalingsmetode: string, i18n: i18n) =>
    i18n.exists(`utbetalingsmetode.${utbetalingsmetode.toLowerCase()}`)
        ? i18n.t(`utbetalingsmetode.${utbetalingsmetode.toLowerCase()}`)
        : utbetalingsmetode;

export { hentUtbetalingTittel, hentTekstForUtbetalingsmetode };
