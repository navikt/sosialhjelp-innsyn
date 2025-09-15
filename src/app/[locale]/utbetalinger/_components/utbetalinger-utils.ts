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

    for (const list of [nye, tidligere]) {
        for (const m of list) {
            const key = `${m.ar}-${m.maned}`;
            const existing = map.get(key);
            if (existing) {
                existing.utbetalingerForManed = [...existing.utbetalingerForManed, ...m.utbetalingerForManed];
            } else {
                map.set(key, {
                    ar: m.ar,
                    maned: m.maned,
                    utbetalingerForManed: [...m.utbetalingerForManed],
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

    const aarSkifte = ({ year, month }: AarMaaned, delta: number): AarMaaned => {
        const base = year * 12 + (month - 1) + delta;
        const y = Math.floor(base / 12);
        const m = ((base % 12) + 12) % 12;
        return { year: y, month: (m + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 };
    };

    switch (chip) {
        case "siste3":
            return { start: aarSkifte(current, -2), end: current };
        case "hittil":
            return { start: { year: current.year, month: 1 }, end: current };
        case "fjor":
            return { start: { year: current.year - 1, month: 1 }, end: { year: current.year - 1, month: 12 } };
        default:
            return null;
    }
};

export const utbetalingInnenforValgtDatoIntervall = (utb: ManedUtbetaling, from: Date, to: Date): boolean => {
    const singleDateStr = utb.utbetalingsdato ?? utb.forfallsdato;
    if (singleDateStr) {
        const d = new Date(singleDateStr);
        return d >= from && d <= to;
    }

    const fom = utb.fom ? new Date(utb.fom) : undefined;
    const tom = utb.tom ? new Date(utb.tom) : undefined;

    if (fom && tom) {
        return !(tom < from || fom > to);
    }
    if (fom) return fom >= from && fom <= to;
    if (tom) return tom >= from && tom <= to;

    return true;
};

export const erInnenforAngittPeriode = (item: NyeOgTidligereUtbetalingerResponse, range: MaanedIntervall | null) => {
    if (!range) return true;
    const itemDate = item.ar * 100 + item.maned;
    const startDate = range.start.year * 100 + range.start.month;
    const endDate = range.end.year * 100 + range.end.month;
    return itemDate >= startDate && itemDate <= endDate;
};
