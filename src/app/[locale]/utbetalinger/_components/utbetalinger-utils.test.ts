import { vi, expect, describe, it, beforeEach, afterEach } from "vitest";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse, ManedUtbetaling } from "@generated/ssr/model";

import {
    kombinertManed,
    datoIntervall,
    utbetalingInnenforValgtDatoIntervall,
    erInnenforAngittPeriode,
    Month1to12,
    AarMaaned,
    ManedIntervall,
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

const am = (year: number, month: Month1to12): AarMaaned => ({ year, month });
const mi = (ys: number, ms: Month1to12, ye: number, me: Month1to12): ManedIntervall => ({
    start: am(ys, ms),
    end: am(ye, me),
});

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

describe("datoIntervall", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returnerer korrekt intervall for siste 3 måneder", () => {
        vi.setSystemTime(new Date(2025, 9, 15));
        expect(datoIntervall("siste3")).toEqual({
            start: { year: 2025, month: 8 },
            end: { year: 2025, month: 10 },
        });
    });

    it("wrap’er riktig over årsskifte (nov→des→jan)", () => {
        vi.setSystemTime(new Date(2025, 0, 10));
        expect(datoIntervall("siste3")).toEqual({
            start: { year: 2024, month: 11 },
            end: { year: 2025, month: 1 },
        });
    });

    it("returnerer korrekt intervall for hittil i år", () => {
        vi.setSystemTime(new Date(2025, 9, 15));
        expect(datoIntervall("hittil")).toEqual({
            start: { year: 2025, month: 1 },
            end: { year: 2025, month: 10 },
        });
    });

    it("returnerer korrekt intervall for i fjor", () => {
        vi.setSystemTime(new Date(2025, 9, 15));
        expect(datoIntervall("fjor")).toEqual({
            start: { year: 2024, month: 1 },
            end: { year: 2024, month: 12 },
        });
    });
});

describe("utbetalingInnenforValgtDatoIntervall", () => {
    it("returns true når utbetalingsdato er innenfor intervall", () => {
        const u = utb({ utbetalingsdato: "2025-09-15" });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforValgtDatoIntervall(u, from, to)).toBe(true);
    });

    it("returns false når utbetalingsdato er utenfor intervall", () => {
        const u = utb({ utbetalingsdato: "2025-08-15" });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforValgtDatoIntervall(u, from, to)).toBe(false);
    });

    it("returns true når forfallsdato er innenfor intervall", () => {
        const u = utb({ utbetalingsdato: undefined, forfallsdato: "2025-09-20" });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforValgtDatoIntervall(u, from, to)).toBe(true);
    });

    it("returns false når forfallsdato er utenfor intervall", () => {
        const u = utb({ utbetalingsdato: undefined, forfallsdato: "2025-10-01" });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforValgtDatoIntervall(u, from, to)).toBe(false);
    });

    it("returns true når fom og tom er innenfor intervall", () => {
        const u = utb({ fom: "2025-09-01", tom: "2025-09-30" });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforValgtDatoIntervall(u, from, to)).toBe(true);
    });

    it("returns false når fom og tom er utenfor intervall", () => {
        const u = utb({
            utbetalingsdato: undefined,
            forfallsdato: undefined,
            fom: "2025-08-01",
            tom: "2025-08-31",
        });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforValgtDatoIntervall(u, from, to)).toBe(false);
    });

    it("returns true når periode overlapper i starten", () => {
        const u = utb({
            utbetalingsdato: undefined,
            forfallsdato: undefined,
            fom: "2025-08-25",
            tom: "2025-09-05",
        });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforValgtDatoIntervall(u, from, to)).toBe(true);
    });

    it("returns true når periode overlapper på slutten", () => {
        const u = utb({
            utbetalingsdato: undefined,
            forfallsdato: undefined,
            fom: "2025-09-20",
            tom: "2025-10-02",
        });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforValgtDatoIntervall(u, from, to)).toBe(true);
    });

    it("returns true når ingen datoer er satt (konservativt inkluder)", () => {
        const u = utb({
            utbetalingsdato: undefined,
            forfallsdato: undefined,
            fom: undefined,
            tom: undefined,
        });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforValgtDatoIntervall(u, from, to)).toBe(true);
    });
});

describe("erInnenforAngittPeriode", () => {
    it("returns true når angitt periode intervall er null", () => {
        const item = { ar: 2025, maned: 9, utbetalingerForManed: [] };
        expect(erInnenforAngittPeriode(item, null)).toBe(true);
    });

    it("returns true når dato er innenfor angitt periode", () => {
        const item = { ar: 2025, maned: 9, utbetalingerForManed: [] };
        const range = mi(2025, 8, 2025, 10);
        expect(erInnenforAngittPeriode(item, range)).toBe(true);
    });

    it("returns false når dato er før angitt periode", () => {
        const item = { ar: 2025, maned: 7, utbetalingerForManed: [] };
        const range = mi(2025, 8, 2025, 10);
        expect(erInnenforAngittPeriode(item, range)).toBe(false);
    });

    it("returns false når dato er etter angitt periode", () => {
        const item = { ar: 2025, maned: 11, utbetalingerForManed: [] };
        const range = mi(2025, 8, 2025, 10);
        expect(erInnenforAngittPeriode(item, range)).toBe(false);
    });

    it("returns true når dato matcher starten av intervallet", () => {
        const item = { ar: 2025, maned: 8, utbetalingerForManed: [] };
        const range = mi(2025, 8, 2025, 10);
        expect(erInnenforAngittPeriode(item, range)).toBe(true);
    });

    it("returns true når dato matcher slutten av intervallet", () => {
        const item = { ar: 2025, maned: 10, utbetalingerForManed: [] };
        const range = mi(2025, 8, 2025, 10);
        expect(erInnenforAngittPeriode(item, range)).toBe(true);
    });

    it("returns true når dato er inklusiv i intervallet", () => {
        const item = { ar: 2025, maned: 8, utbetalingerForManed: [] };
        const range = mi(2025, 8, 2025, 8);
        expect(erInnenforAngittPeriode(item, range)).toBe(true);
    });
});
