import { expect, describe, it } from "vitest";
import { endOfMonth, Interval, interval, startOfMonth } from "date-fns";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse, ManedUtbetaling } from "@generated/ssr/model";

import {
    kombinertManed,
    utbetalingInnenforIntervall,
    erInnenforIntervall,
    formaterKontonummer,
} from "./utbetalinger-utils";

const utb = (overrides: Partial<ManedUtbetaling> = {}): ManedUtbetaling => ({
    referanse: "ref",
    tittel: "tittel",
    belop: 1000,
    utbetalingsdato: "2025-09-19",
    forfallsdato: "2025-09-18",
    status: ManedUtbetalingStatus.PLANLAGT_UTBETALING,
    fiksDigisosId: "id1",
    fom: "2025-09-01",
    tom: "2025-09-30",
    mottaker: "meg",
    annenMottaker: false,
    kontonummer: "12345678901",
    utbetalingsmetode: "BANKKONTO",
    ...overrides,
});

const dateFromYearAndMonth = (year: number, month: number): Date => new Date(year, month - 1);
const intervalFromYearsAndMonths = (
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number
): Interval =>
    interval(
        startOfMonth(dateFromYearAndMonth(startYear, startMonth)),
        endOfMonth(dateFromYearAndMonth(endYear, endMonth))
    );

describe("kombinertManed", () => {
    it("kombinerer og sorterer måneder fra 'nye' og 'tidligere'", () => {
        const nye: NyeOgTidligereUtbetalingerResponse[] = [
            { ar: 2025, maned: 10, utbetalingerForManed: [utb({ tittel: "halloen" })] },
        ];

        const tidligere: NyeOgTidligereUtbetalingerResponse[] = [
            {
                ar: 2025,
                maned: 8,
                utbetalingerForManed: [
                    utb({
                        tittel: "neinei",
                        utbetalingsdato: "2025-08-19",
                        forfallsdato: "2025-08-18",
                        fom: "2025-08-01",
                        tom: "2025-08-30",
                    }),
                ],
            },
        ];

        const result = kombinertManed(nye, tidligere);

        expect(result).toEqual([
            {
                ar: 2025,
                maned: 8,
                utbetalingerForManed: [expect.objectContaining({ tittel: "neinei" })],
            },
            {
                ar: 2025,
                maned: 10,
                utbetalingerForManed: [expect.objectContaining({ tittel: "halloen" })],
            },
        ]);
    });

    it("merger utbetalinger når samme år/måned finnes i begge listene", () => {
        const a: NyeOgTidligereUtbetalingerResponse[] = [
            { ar: 2025, maned: 9, utbetalingerForManed: [utb({ tittel: "A" })] },
        ];
        const b: NyeOgTidligereUtbetalingerResponse[] = [
            { ar: 2025, maned: 9, utbetalingerForManed: [utb({ tittel: "B" })] },
        ];

        const result = kombinertManed(a, b);

        expect(result).toHaveLength(1);
        expect(result[0].ar).toBe(2025);
        expect(result[0].maned).toBe(9);
        expect(result[0].utbetalingerForManed.map((utbetaling) => utbetaling.tittel)).toEqual(["A", "B"]);
    });
});

describe("utbetalingInnenforValgtDatoIntervall", () => {
    it("returns true når utbetalingsdato er innenfor intervall", () => {
        const u = utb({ utbetalingsdato: "2025-09-15" });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforIntervall(u, interval(from, to))).toBe(true);
    });

    it("returns false når utbetalingsdato er utenfor intervall", () => {
        const u = utb({ utbetalingsdato: "2025-08-15" });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforIntervall(u, interval(from, to))).toBe(false);
    });

    it("returns true når forfallsdato er innenfor intervall", () => {
        const u = utb({ utbetalingsdato: undefined, forfallsdato: "2025-09-20" });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforIntervall(u, interval(from, to))).toBe(true);
    });

    it("returns false når forfallsdato er utenfor intervall", () => {
        const u = utb({ utbetalingsdato: undefined, forfallsdato: "2025-10-01" });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforIntervall(u, interval(from, to))).toBe(false);
    });

    it("returns true når fom og tom er innenfor intervall", () => {
        const u = utb({ fom: "2025-09-01", tom: "2025-09-30" });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforIntervall(u, interval(from, to))).toBe(true);
    });

    it("returns false når ingen datoer er satt", () => {
        const u = utb({
            utbetalingsdato: undefined,
            forfallsdato: undefined,
            fom: undefined,
            tom: undefined,
        });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforIntervall(u, interval(from, to))).toBe(false);
    });
});

describe("erInnenforAngittPeriode", () => {
    it("returns true når angitt periode intervall er null", () => {
        const item = { ar: 2025, maned: 9, utbetalingerForManed: [] };
        expect(erInnenforIntervall(item, null)).toBe(true);
    });

    it("returns true når dato er innenfor angitt periode", () => {
        const item = { ar: 2025, maned: 9, utbetalingerForManed: [] };
        const range = intervalFromYearsAndMonths(2025, 8, 2025, 10);
        expect(erInnenforIntervall(item, range)).toBe(true);
    });

    it("returns false når dato er før angitt periode", () => {
        const item = { ar: 2025, maned: 7, utbetalingerForManed: [] };
        const range = intervalFromYearsAndMonths(2025, 9, 2025, 11);
        expect(erInnenforIntervall(item, range)).toBe(false);
    });

    it("returns false når dato er etter angitt periode", () => {
        const item = { ar: 2025, maned: 11, utbetalingerForManed: [] };
        const range = intervalFromYearsAndMonths(2025, 8, 2025, 10);
        expect(erInnenforIntervall(item, range)).toBe(false);
    });

    it("returns true når dato matcher starten av intervallet", () => {
        const item = { ar: 2025, maned: 8, utbetalingerForManed: [] };
        const range = intervalFromYearsAndMonths(2025, 8, 2025, 10);
        expect(erInnenforIntervall(item, range)).toBe(true);
    });

    it("returns true når dato matcher slutten av intervallet", () => {
        const item = { ar: 2025, maned: 10, utbetalingerForManed: [] };
        const range = intervalFromYearsAndMonths(2025, 8, 2025, 10);
        expect(erInnenforIntervall(item, range)).toBe(true);
    });

    it("returns true når dato er inklusiv i intervallet", () => {
        const item = { ar: 2025, maned: 8, utbetalingerForManed: [] };
        const range = intervalFromYearsAndMonths(2025, 8, 2025, 8);
        expect(erInnenforIntervall(item, range)).toBe(true);
    });
});

describe("formaterKontonummer", () => {
    it("formatere 11 kontinuerlige tall til 4-2-5", () => {
        expect(formaterKontonummer("12345678901")).toBe("1234 56 78901");
    });

    it("kontonummeret blir uendret ", () => {
        expect(formaterKontonummer("1234 56 78901")).toBe("1234 56 78901");
    });
});
