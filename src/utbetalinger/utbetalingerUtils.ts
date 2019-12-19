import {UtbetalingMaaned, UtbetalingSakType} from "./service/useUtbetalingerService";

const diffInMonths = (d1: Date, d2: Date) => {
    var d1Y = d1.getFullYear();
    var d2Y = d2.getFullYear();
    var d1M = d1.getMonth();
    var d2M = d2.getMonth();
    return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
};
const filtrerUtbetalingerForTidsinterval = (utbetalinger: UtbetalingSakType[], visAntallMnd: number, now: Date): UtbetalingSakType[] => {
    return utbetalinger.filter((utbetalingSak: UtbetalingSakType) => {
        const foersteIManeden: Date = new Date(utbetalingSak.foersteIManeden);
        const innenforTidsintervall: boolean = diffInMonths(foersteIManeden, now) < visAntallMnd;
        return innenforTidsintervall;
    });
};
const filtrerUtbetalingerPaaMottaker = (utbetalinger: UtbetalingSakType[], visTilBrukersKonto: boolean, visTilAnnenMottaker: boolean): UtbetalingSakType[] => {
    return utbetalinger.map((utbetalingSak: UtbetalingSakType) => {
        return {
            ...utbetalingSak,
            utbetalinger: utbetalingSak.utbetalinger.filter((utbetalingMaaned: UtbetalingMaaned, index: number) => {
                const blirBetaltTilBruker: boolean =
                    (utbetalingMaaned.mottaker === "søkers fnr") ||
                    (utbetalingMaaned.mottaker.match(/^[0-9]{3,}/) !== null);
                if (blirBetaltTilBruker) {
                    return visTilBrukersKonto;
                } else {
                    return visTilAnnenMottaker;
                }
            })
        };
    });
};
export {filtrerUtbetalingerPaaMottaker, filtrerUtbetalingerForTidsinterval, diffInMonths};
