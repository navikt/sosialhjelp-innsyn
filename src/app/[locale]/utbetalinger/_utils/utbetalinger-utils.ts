import {
    isWithinInterval,
    subMonths,
    Interval,
    interval,
    subYears,
    startOfYear,
    endOfYear,
    subDays,
    endOfDay,
    startOfDay,
    getMonth,
    getYear,
    isBefore,
    parseISO,
} from "date-fns";
import { UtbetalingDto } from "@generated/ssr/model";

import { PeriodeChip, Option, ManedMedUtbetalinger } from "../_types/types";
import { UtbetalingDtoStatus } from "@generated/model";

const tillatteStatuserKommende = new Set<UtbetalingDtoStatus>([
    UtbetalingDtoStatus.PLANLAGT_UTBETALING,
    UtbetalingDtoStatus.STOPPET,
    UtbetalingDtoStatus.UTBETALT,
]);

const tillateStatuserPeriode = new Set<UtbetalingDtoStatus>([
    UtbetalingDtoStatus.UTBETALT,
    UtbetalingDtoStatus.STOPPET,
]);

const erPeriodeChip = (c: Option): c is PeriodeChip => {
    return c === "siste3" || c === "hittil" || c === "fjor";
};

//Datoen som avgjør hvor en utbetaling hører hjemme: faktisk utbetalingsdato hvis den finnes, ellers forfallsdato.
const hentReferanseDato = (utb: UtbetalingDto): Date | null => {
    const dato = utb.utbetalingsdato ?? utb.forfallsdato;
    return dato ? parseISO(dato) : null;
};

export const sorterUtbetalingerEtterDato = (utbetalinger: UtbetalingDto[]): UtbetalingDto[] => {
    return [...utbetalinger].sort((a, b) => {
        const datoA = hentReferanseDato(a)?.getTime() ?? 0;
        const datoB = hentReferanseDato(b)?.getTime() ?? 0;
        return datoA - datoB;
    });
};

export const sorterManeder = (maneder: ManedMedUtbetalinger[]): ManedMedUtbetalinger[] =>
    [...maneder].sort((a, b) => (a.ar === b.ar ? a.maned - b.maned : a.ar - b.ar));

export const grupperUtbetalingerEtterManed = (utbetalinger: UtbetalingDto[]): ManedMedUtbetalinger[] => {
    const grouped = Object.values(
        utbetalinger.reduce<Record<string, ManedMedUtbetalinger>>((acc, utbetaling) => {
            const dato = hentReferanseDato(utbetaling)!;
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
            // Slutter i går – utbetalinger med dato i dag vises under "Kommende"
            return interval(startOfDay(startDato), endOfDay(subDays(dagens, 1)));
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

export const utbetalingInnenforIntervall = (utb: UtbetalingDto, interval: Interval): boolean => {
    const referanseDato = hentReferanseDato(utb);
    return referanseDato ? isWithinInterval(referanseDato, interval) : false;
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
        case "kommende": {
            const iDag = startOfDay(new Date());
            return data.filter((utbetaling) => {
                const referanseDato = hentReferanseDato(utbetaling);
                // Dato i dag eller senere – dagens utbetalinger skal fortsatt vises som kommende
                return (
                    tillatteStatuserKommende.has(utbetaling.status) &&
                    referanseDato !== null &&
                    !isBefore(referanseDato, iDag)
                );
            });
        }
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
