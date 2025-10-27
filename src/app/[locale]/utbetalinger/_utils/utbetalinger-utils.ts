import {
    isWithinInterval,
    startOfMonth,
    areIntervalsOverlapping,
    subMonths,
    Interval,
    interval,
    subYears,
    startOfYear,
    endOfYear,
    addDays,
    endOfDay,
    startOfDay,
    endOfMonth,
} from "date-fns";

import { ManedUtbetaling, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { Option } from "../_components/Utbetalinger";

type PeriodeChip = "siste3" | "hittil" | "fjor";

export const erPeriodeChip = (c: Option): c is PeriodeChip => {
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

export const datoIntervall = (chip: "siste3" | "hittil" | "fjor"): Interval | null => {
    const dagens = new Date();

    switch (chip) {
        case "siste3": {
            const startDato = subMonths(dagens, 2);
            return interval(startOfDay(startDato), endOfDay(addDays(dagens, 1)));
        }
        case "hittil":
            return interval(startOfYear(dagens), dagens);
        case "fjor": {
            const lastYear = subYears(dagens, 1);
            return interval(startOfYear(lastYear), endOfYear(lastYear));
        }
        default:
            return null;
    }
};

export const utbetalingInnenforIntervall = (utb: ManedUtbetaling, interval: Interval): boolean => {
    const referanseDato = utb.utbetalingsdato ?? utb.forfallsdato;
    if (referanseDato) {
        return isWithinInterval(new Date(referanseDato), interval);
    }

    return false;
};

export const erInnenforIntervall = (item: NyeOgTidligereUtbetalingerResponse, intervall: Interval | null | false) => {
    if (!intervall) return true;
    const date = new Date(item.ar, item.maned - 1);
    const itemInterval = interval(startOfMonth(date), endOfMonth(date));
    return areIntervalsOverlapping(itemInterval, intervall);
};

export const formaterKontonummer = (kontonummer?: string | null): string | undefined => {
    if (!kontonummer) return undefined;
    // Trenger ikke å gjøre noe hvis det allerede er formatert rett
    if (/^\d{4}\s\d{2}\s\d{5}$/.test(kontonummer)) {
        return kontonummer;
    }
    const kontonr = kontonummer.replace(/\D/g, "");
    if (kontonr.length !== 11) return kontonummer;
    return `${kontonr.slice(0, 4)} ${kontonr.slice(4, 6)} ${kontonr.slice(6)}`;
};
