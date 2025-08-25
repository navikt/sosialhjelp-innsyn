// utbetalinger/shared/utbetalinger-utils.ts
import { ManedUtbetaling, ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

export type MonthBucket = {
    ar: number;
    maned: number;
    utbetalingerForManed: ManedUtbetaling[];
};

export type DateRange = { from: Date; to: Date };

export type ChipsChip = "kommende" | "siste3" | "hitil" | "fjor" | "egendefinert";

// Merge months from multiple lists by (ar, maned)
export function combineMonths(...lists: Array<NyeOgTidligereUtbetalingerResponse[] | undefined>): MonthBucket[] {
    const map = new Map<string, MonthBucket>();
    for (const list of lists) {
        if (!list) continue;
        for (const m of list) {
            const key = `${m.ar}-${m.maned}`;
            const existing = map.get(key);
            if (existing) {
                existing.utbetalingerForManed = existing.utbetalingerForManed.concat(m.utbetalingerForManed);
            } else {
                map.set(key, {
                    ar: m.ar,
                    maned: m.maned,
                    utbetalingerForManed: [...m.utbetalingerForManed],
                });
            }
        }
    }
    return [...map.values()].sort((a, b) => (a.ar === b.ar ? a.maned - b.maned : a.ar - b.ar));
}

export function getRangeForChip(chip: ChipsChip): DateRange | null {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const startOf = (y: number, m: number) => new Date(y, m - 1, 1);
    const endOf = (y: number, m: number) => new Date(y, m, 0, 23, 59, 59, 999);

    switch (chip) {
        case "siste3": {
            const startM = Math.max(1, month - 2);
            return { from: startOf(year, startM), to: endOf(year, month) };
        }
        case "hitil":
            return { from: startOf(year, 1), to: endOf(year, month) };
        case "fjor":
            return { from: startOf(year - 1, 1), to: endOf(year - 1, 12) };
        default:
            return null;
    }
}

// Prefer utbetalingsdato/forfallsdato; otherwise fall back to period overlap (fom/tom)
function utbetalingInRange(utb: ManedUtbetaling, range: DateRange): boolean {
    const single = utb.utbetalingsdato ?? utb.forfallsdato;
    if (single) {
        const d = new Date(single);
        return d >= range.from && d <= range.to;
    }
    const fom = utb.fom ? new Date(utb.fom) : undefined;
    const tom = utb.tom ? new Date(utb.tom) : undefined;
    if (fom && tom) return !(tom < range.from || fom > range.to);
    if (fom) return fom >= range.from && fom <= range.to;
    if (tom) return tom >= range.from && tom <= range.to;
    return true; // safelist unknowns
}

function utbetalingIsFuture(utb: ManedUtbetaling, now = new Date()): boolean {
    const single = utb.utbetalingsdato ?? utb.forfallsdato ?? utb.fom ?? utb.tom;
    if (!single) return true;
    return new Date(single) >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function filterBuckets(
    buckets: MonthBucket[],
    opts: {
        range?: DateRange | null;
        includeStatuses?: ManedUtbetalingStatus[];
        onlyFuture?: boolean;
    } = {}
): MonthBucket[] {
    const { range, includeStatuses, onlyFuture } = opts;

    return buckets
        .map((m) => ({
            ...m,
            utbetalingerForManed: m.utbetalingerForManed.filter((u) => {
                if (includeStatuses && !includeStatuses.includes(u.status)) return false;
                if (onlyFuture && !utbetalingIsFuture(u)) return false;
                if (range && !utbetalingInRange(u, range)) return false;
                return true;
            }),
        }))
        .filter((m) => m.utbetalingerForManed.length > 0);
}

export function sumByStatuses(m: MonthBucket, statuses: ManedUtbetalingStatus[]): number {
    return m.utbetalingerForManed.filter((u) => statuses.includes(u.status)).reduce((acc, u) => acc + u.belop, 0);
}
