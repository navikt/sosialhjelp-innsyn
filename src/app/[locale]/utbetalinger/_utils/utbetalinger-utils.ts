import {
    isWithinInterval,
    subMonths,
    Interval,
    interval,
    subYears,
    startOfYear,
    endOfYear,
    addDays,
    endOfDay,
    startOfDay,
    getMonth,
    getYear,
} from "date-fns";

import { ManedUtbetaling, ManedUtbetalingStatus, UtbetalingDto } from "@generated/ssr/model";

import { PeriodeChip, Option, ManedMedUtbetalinger } from "../_types/types";

const tillatteStatuserKommende = new Set<ManedUtbetalingStatus>([
    ManedUtbetalingStatus.PLANLAGT_UTBETALING,
    ManedUtbetalingStatus.STOPPET,
]);

const tillateStatuserPeriode = new Set<ManedUtbetalingStatus>([
    ManedUtbetalingStatus.UTBETALT,
    ManedUtbetalingStatus.STOPPET,
]);

const erPeriodeChip = (c: Option): c is PeriodeChip => {
    return c === "siste3" || c === "hittil" || c === "fjor";
};

export const sorterUtbetalingerEtterDato = (utbetalinger: UtbetalingDto[]): UtbetalingDto[] => {
    return [...utbetalinger].sort((a, b) => {
        const datoA = new Date(a.utbetalingsdato ?? a.forfallsdato ?? 0);
        const datoB = new Date(b.utbetalingsdato ?? b.forfallsdato ?? 0);
        return datoA.getTime() - datoB.getTime();
    });
};

export const sorterManeder = (maneder: ManedMedUtbetalinger[]): ManedMedUtbetalinger[] =>
    [...maneder].sort((a, b) => (a.ar === b.ar ? a.maned - b.maned : a.ar - b.ar));

export const grupperUtbetalingerEtterManed = (utbetalinger: UtbetalingDto[]): ManedMedUtbetalinger[] => {
    const grouped = Object.values(
        utbetalinger.reduce<Record<string, ManedMedUtbetalinger>>((acc, utbetaling) => {
            const referanseDato = utbetaling.utbetalingsdato ?? utbetaling.forfallsdato;
            const dato = new Date(referanseDato!);
            const ar = getYear(dato);
            const maned = getMonth(dato) + 1;
            const key = `${ar}-${maned}`;

            if (!acc[key]) {
                acc[key] = { ar, maned, utbetalinger: [] };
            }
            acc[key].utbetalinger.push(utbetaling);

            return acc;
        }, {})
    );

    const withSortedUtbetalinger = grouped.map((item) => ({
        ...item,
        utbetalinger: sorterUtbetalingerEtterDato(item.utbetalinger),
    }));

    return sorterManeder(withSortedUtbetalinger);
};

const datoIntervall = (chip: "siste3" | "hittil" | "fjor"): Interval | null => {
    const dagens = new Date();

    switch (chip) {
        case "siste3": {
            const startDato = subMonths(dagens, 3);
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

const utbetalingInnenforIntervall = (utb: ManedUtbetaling, interval: Interval): boolean => {
    const referanseDato = utb.utbetalingsdato ?? utb.forfallsdato;
    if (referanseDato) {
        return isWithinInterval(new Date(referanseDato), interval);
    }

    return false;
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

export const filtrerUtbetalinger = (selectedChip: Option, data: UtbetalingDto[], selectedRange?: Interval) => {
    const intervall = erPeriodeChip(selectedChip) && datoIntervall(selectedChip);
    switch (selectedChip) {
        case "kommende":
            return data.filter(
                (utbetaling) =>
                    tillatteStatuserKommende.has(utbetaling.status) &&
                    utbetaling.forfallsdato &&
                    new Date(utbetaling.forfallsdato) > new Date()
            );
        case "egendefinert":
            if (!selectedRange) return null;
            return data.filter((utbetaling) => utbetalingInnenforIntervall(utbetaling, selectedRange));
        case "siste3":
        case "hittil":
        case "fjor":
            if (!intervall) return null;
            return data.filter(
                (utbetaling) =>
                    tillateStatuserPeriode.has(utbetaling.status) && utbetalingInnenforIntervall(utbetaling, intervall)
            );
    }
};
