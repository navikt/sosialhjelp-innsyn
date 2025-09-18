import { endOfMonth, isWithinInterval, startOfMonth, areIntervalsOverlapping } from "date-fns";

import { ManedUtbetaling, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { ChipsChip } from "./Utbetalinger";

export type PeriodeChip = "siste3" | "hittil" | "fjor";
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

export type AarMaaned = { year: number; month: number };
export type MaanedIntervall = { start: AarMaaned; end: AarMaaned };

export const datoIntervall = (chip: "siste3" | "hittil" | "fjor"): MaanedIntervall | null => {
    const today = new Date();
    const current: AarMaaned = { year: today.getFullYear(), month: today.getMonth() + 1 };

    const forskyvMaaned = ({ year, month }: AarMaaned, delta: number): AarMaaned => {
        const base = year * 12 + (month - 1) + delta;
        const y = Math.floor(base / 12);
        const m = ((base % 12) + 12) % 12;
        return { year: y, month: (m + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 };
    };

    switch (chip) {
        case "siste3":
            return { start: forskyvMaaned(current, -2), end: current };
        case "hittil":
            return { start: { year: current.year, month: 1 }, end: current };
        case "fjor":
            return { start: { year: current.year - 1, month: 1 }, end: { year: current.year - 1, month: 12 } };
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

export const erInnenforAngittPeriode = (item: NyeOgTidligereUtbetalingerResponse, range: MaanedIntervall | null) => {
    if (!range) return true;

    const itemInterval = {
        start: startOfMonth(new Date(item.ar, item.maned - 1, 1)),
        end: endOfMonth(new Date(item.ar, item.maned - 1, 1)),
    };

    const selectedInterval = {
        start: startOfMonth(new Date(range.start.year, range.start.month - 1, 1)),
        end: endOfMonth(new Date(range.end.year, range.end.month - 1, 1)),
    };

    return areIntervalsOverlapping(itemInterval, selectedInterval, { inclusive: true });
};
