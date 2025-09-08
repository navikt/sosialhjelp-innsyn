import { NyeOgTidligereUtbetalingerResponse } from "@generated/model";
import { ManedUtbetaling } from "@generated/ssr/model";

import { ChipsChip } from "./Utbetalinger";

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

export type PeriodChip = "siste3" | "hittil" | "fjor";
export const isPeriodChip = (c: ChipsChip): c is PeriodChip => {
    return c === "siste3" || c === "hittil" || c === "fjor";
};

export const datoIntervall = (chip: "siste3" | "hittil" | "fjor"): MaanedIntervall | null => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    switch (chip) {
        case "siste3":
            return {
                start: { year, month: Math.max(1, month - 2) },
                end: { year, month },
            };
        case "hittil":
            return {
                start: { year, month: 1 },
                end: { year, month },
            };
        case "fjor":
            return {
                start: { year: year - 1, month: 1 },
                end: { year: year - 1, month: 12 },
            };
        default:
            return null;
    }
};

export const utbetalingInnenforDatoIntervall = (utb: ManedUtbetaling, from: Date, to: Date): boolean => {
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

export const erInnenforAngittDato = (item: NyeOgTidligereUtbetalingerResponse, range: MaanedIntervall | null) => {
    if (!range) return true;
    const itemDate = item.ar * 100 + item.maned;
    const startDate = range.start.year * 100 + range.start.month;
    const endDate = range.end.year * 100 + range.end.month;
    return itemDate >= startDate && itemDate <= endDate;
};
