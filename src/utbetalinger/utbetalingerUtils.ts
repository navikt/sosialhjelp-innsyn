import {ManedUtbetaling, UtbetalingerResponse} from "../generated/model";
import {t} from "i18next";

const diffInMonths = (d1: Date, d2: Date) => {
    var d1Y = d1.getFullYear();
    var d2Y = d2.getFullYear();
    var d1M = d1.getMonth();
    var d2M = d2.getMonth();
    return d2M + 12 * d2Y - (d1M + 12 * d1Y);
};
const filtrerUtbetalingerForTidsinterval = (
    utbetalinger: UtbetalingerResponse[],
    visAntallMnd: number,
    now: Date
): UtbetalingerResponse[] => {
    return utbetalinger.filter((utbetalingSak: UtbetalingerResponse) => {
        const foersteIManeden: Date = new Date(utbetalingSak.foersteIManeden);
        return diffInMonths(foersteIManeden, now) < visAntallMnd;
    });
};

const filtrerUtbetalingerPaaMottaker = (
    utbetalinger: UtbetalingerResponse[],
    visTilBrukersKonto: boolean,
    visTilAnnenMottaker: boolean
): UtbetalingerResponse[] => {
    return utbetalinger.map((utbetalingSak: UtbetalingerResponse) => {
        return {
            ...utbetalingSak,
            utbetalinger: utbetalingSak.utbetalinger.filter((utbetalingMaaned: ManedUtbetaling) => {
                const annenMottaker = utbetalingMaaned.annenMottaker;
                if (!annenMottaker) {
                    return visTilBrukersKonto;
                } else {
                    return visTilAnnenMottaker;
                }
            }),
        };
    });
};

const filtrerMaanederUtenUtbetalinger = (utbetalinger: UtbetalingerResponse[]): UtbetalingerResponse[] => {
    return utbetalinger.filter((utbetalingSak: UtbetalingerResponse) => {
        return utbetalingSak.utbetalinger.length > 0;
    });
};

const DEFAULT_UTBETALINGER_TITTEL = "default_utbetalinger_tittel";

const hentUtbetalingTittel = (tittel: string) => {
    return tittel && tittel !== DEFAULT_UTBETALINGER_TITTEL ? tittel : t(DEFAULT_UTBETALINGER_TITTEL);
};

export {
    filtrerUtbetalingerPaaMottaker,
    filtrerUtbetalingerForTidsinterval,
    filtrerMaanederUtenUtbetalinger,
    diffInMonths,
    hentUtbetalingTittel,
};
