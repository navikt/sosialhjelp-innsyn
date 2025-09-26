import {
    endOfMonth,
    isWithinInterval,
    startOfMonth,
    areIntervalsOverlapping,
    getYear,
    getMonth,
    subMonths,
} from "date-fns";

import { ManedUtbetaling, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { ChipsChip } from "./Utbetalinger";

type PeriodeChip = "siste3" | "hittil" | "fjor";
export const erPeriodeChip = (c: ChipsChip): c is PeriodeChip => {
    return c === "siste3" || c === "hittil" || c === "fjor";
};

export const kombinertManed = (
    nye: NyeOgTidligereUtbetalingerResponse[] = [],
    tidligere: NyeOgTidligereUtbetalingerResponse[] = []
): NyeOgTidligereUtbetalingerResponse[] => {
    const map = new Map<string, NyeOgTidligereUtbetalingerResponse>();

    for (const kombinertList of [nye, tidligere]) {
        for (const maned of kombinertList) {
            const key = `${maned.ar}-${maned.maned}`;
            const existing = map.get(key);
            if (existing) {
                existing.utbetalingerForManed = [...existing.utbetalingerForManed, ...maned.utbetalingerForManed];
            } else {
                map.set(key, {
                    ar: maned.ar,
                    maned: maned.maned,
                    utbetalingerForManed: [...maned.utbetalingerForManed],
                });
            }
        }
    }
    return Array.from(map.values()).sort((a, b) => (a.ar === b.ar ? a.maned - b.maned : a.ar - b.ar));
};

export type Month1to12 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type AarMaaned = { year: number; month: Month1to12 };
export type ManedIntervall = { start: AarMaaned; end: AarMaaned };

const tilAarMaaned = (dato: Date) => ({
    year: getYear(dato),
    month: (getMonth(dato) + 1) as Month1to12,
});

export const datoIntervall = (chip: "siste3" | "hittil" | "fjor"): ManedIntervall | null => {
    const dagens = new Date();

    switch (chip) {
        case "siste3": {
            const startDato = subMonths(dagens, 2);
            return { start: tilAarMaaned(startDato), end: tilAarMaaned(dagens) };
        }
        case "hittil":
            return { start: { year: getYear(dagens), month: 1 }, end: tilAarMaaned(dagens) };
        case "fjor": {
            const y = getYear(dagens) - 1;
            return { start: { year: y, month: 1 }, end: { year: y, month: 12 } };
        }
        default:
            return null;
    }
};

export const utbetalingInnenforValgtDatoIntervall = (utb: ManedUtbetaling, from: Date, to: Date): boolean => {
    const intervall = { start: from, end: to };

    const referanseDato = utb.utbetalingsdato ?? utb.forfallsdato;
    if (referanseDato) {
        return isWithinInterval(new Date(referanseDato), intervall);
    }

    const fom = utb.fom ? new Date(utb.fom) : undefined;
    const tom = utb.tom ? new Date(utb.tom) : undefined;

    if (fom && tom) {
        return areIntervalsOverlapping({ start: fom, end: tom }, intervall, { inclusive: true });
    }
    if (fom) return isWithinInterval(fom, intervall);
    if (tom) return isWithinInterval(tom, intervall);

    return true;
};

export const erInnenforAngittPeriode = (item: NyeOgTidligereUtbetalingerResponse, intervall: ManedIntervall | null) => {
    if (!intervall) return true;
    const itemDate = startOfMonth(new Date(item.ar, item.maned - 1, 1));
    const start = startOfMonth(new Date(intervall.start.year, intervall.start.month - 1, 1));
    const end = endOfMonth(new Date(intervall.end.year, intervall.end.month - 1, 1));
    return isWithinInterval(itemDate, { start, end });
};
