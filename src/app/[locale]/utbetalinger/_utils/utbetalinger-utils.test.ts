import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { interval } from "date-fns";

import { UtbetalingDto, UtbetalingDtoStatus } from "@generated/ssr/model";

import { ManedMedUtbetalinger } from "../_types/types";

import {
    sorterUtbetalingerEtterDato,
    sorterManeder,
    grupperUtbetalingerEtterManed,
    utbetalingInnenforIntervall,
    formaterKontonummer,
    filtrerUtbetalinger,
} from "./utbetalinger-utils";

const utb = (overrides: Partial<UtbetalingDto> = {}): UtbetalingDto => ({
    referanse: "ref",
    tittel: "tittel",
    belop: 1000,
    utbetalingsdato: "2025-09-19",
    forfallsdato: "2025-09-18",
    status: UtbetalingDtoStatus.PLANLAGT_UTBETALING,
    fiksDigisosId: "id1",
    fom: "2025-09-01",
    tom: "2025-09-30",
    mottaker: "meg",
    annenMottaker: false,
    kontonummer: "12345678901",
    utbetalingsmetode: "BANKKONTO",
    ...overrides,
});

describe("sorterUtbetalingerEtterDato", () => {
    it("sorterer utbetalinger basert på utbetalingsdato", () => {
        const utbetalinger = [
            utb({ utbetalingsdato: "2025-09-20", tittel: "Senere" }),
            utb({ utbetalingsdato: "2025-09-10", tittel: "Tidligere" }),
            utb({ utbetalingsdato: "2025-09-15", tittel: "Midten" }),
        ];

        const result = sorterUtbetalingerEtterDato(utbetalinger);

        expect(result.map((u) => u.tittel)).toEqual(["Tidligere", "Midten", "Senere"]);
    });

    it("bruker forfallsdato når utbetalingsdato mangler", () => {
        const utbetalinger = [
            utb({ utbetalingsdato: undefined, forfallsdato: "2025-09-25", tittel: "Forfallsdato" }),
            utb({ utbetalingsdato: "2025-09-15", tittel: "Utbetalingsdato" }),
        ];

        const result = sorterUtbetalingerEtterDato(utbetalinger);

        expect(result.map((u) => u.tittel)).toEqual(["Utbetalingsdato", "Forfallsdato"]);
    });

    it("håndterer tilfelle der begge datoer mangler", () => {
        const utbetalinger = [
            utb({ utbetalingsdato: "2025-09-15", tittel: "Med dato" }),
            utb({ utbetalingsdato: undefined, forfallsdato: undefined, tittel: "Uten dato" }),
        ];

        const result = sorterUtbetalingerEtterDato(utbetalinger);

        expect(result).toHaveLength(2);
        expect(result[0].tittel).toBe("Uten dato"); // 0 timestamp kommer først
        expect(result[1].tittel).toBe("Med dato");
    });
});

describe("sorterManeder", () => {
    it("sorterer måneder etter år og måned", () => {
        const maneder: ManedMedUtbetalinger[] = [
            { ar: 2025, maned: 10, utbetalinger: [] },
            { ar: 2024, maned: 12, utbetalinger: [] },
            { ar: 2025, maned: 8, utbetalinger: [] },
        ];

        const result = sorterManeder(maneder);

        expect(result.map((m) => ({ ar: m.ar, maned: m.maned }))).toEqual([
            { ar: 2024, maned: 12 },
            { ar: 2025, maned: 8 },
            { ar: 2025, maned: 10 },
        ]);
    });

    it("sorterer måneder innenfor samme år", () => {
        const maneder: ManedMedUtbetalinger[] = [
            { ar: 2025, maned: 12, utbetalinger: [] },
            { ar: 2025, maned: 3, utbetalinger: [] },
            { ar: 2025, maned: 7, utbetalinger: [] },
        ];

        const result = sorterManeder(maneder);

        expect(result.map((m) => m.maned)).toEqual([3, 7, 12]);
    });
});

describe("grupperUtbetalingerEtterManed", () => {
    it("grupperer utbetalinger etter år og måned basert på utbetalingsdato", () => {
        const utbetalinger = [
            utb({ utbetalingsdato: "2025-09-15", tittel: "Sept 1" }),
            utb({ utbetalingsdato: "2025-10-20", tittel: "Okt 1" }),
            utb({ utbetalingsdato: "2025-09-25", tittel: "Sept 2" }),
        ];

        const result = grupperUtbetalingerEtterManed(utbetalinger);

        expect(result).toHaveLength(2);

        const sept = result.find((m) => m.ar === 2025 && m.maned === 9);
        const okt = result.find((m) => m.ar === 2025 && m.maned === 10);

        expect(sept?.utbetalinger).toHaveLength(2);
        expect(okt?.utbetalinger).toHaveLength(1);
        expect(sept?.utbetalinger.map((u) => u.tittel)).toEqual(["Sept 1", "Sept 2"]);
    });

    it("bruker forfallsdato når utbetalingsdato mangler", () => {
        const utbetalinger = [
            utb({ utbetalingsdato: undefined, forfallsdato: "2025-08-10", tittel: "August" }),
            utb({ utbetalingsdato: "2025-09-15", tittel: "September" }),
        ];

        const result = grupperUtbetalingerEtterManed(utbetalinger);

        expect(result).toHaveLength(2);
        expect(result.some((m) => m.ar === 2025 && m.maned === 8)).toBe(true);
        expect(result.some((m) => m.ar === 2025 && m.maned === 9)).toBe(true);
    });

    it("sorterer måneder og utbetalinger i riktig rekkefølge", () => {
        const utbetalinger = [
            utb({ utbetalingsdato: "2025-10-25", tittel: "Okt sent" }),
            utb({ utbetalingsdato: "2025-09-10", tittel: "Sept tidlig" }),
            utb({ utbetalingsdato: "2025-10-05", tittel: "Okt tidlig" }),
        ];

        const result = grupperUtbetalingerEtterManed(utbetalinger);

        expect(result).toHaveLength(2);

        // Måneder sortert
        expect(result[0].maned).toBe(9);
        expect(result[1].maned).toBe(10);

        // Utbetalinger innenfor måned sortert
        expect(result[1].utbetalinger.map((u) => u.tittel)).toEqual(["Okt tidlig", "Okt sent"]);
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

    it("returns false når ingen datoer er satt", () => {
        const u = utb({
            utbetalingsdato: undefined,
            forfallsdato: undefined,
        });
        const from = new Date("2025-09-01");
        const to = new Date("2025-09-30");
        expect(utbetalingInnenforIntervall(u, interval(from, to))).toBe(false);
    });
});

describe("formaterKontonummer", () => {
    it("formatere 11 kontinuerlige tall til 4-2-5", () => {
        expect(formaterKontonummer("12345678901")).toBe("1234 56 78901");
    });

    it("kontonummeret blir uendret", () => {
        expect(formaterKontonummer("1234 56 78901")).toBe("1234 56 78901");
    });
});

describe("filtrerUtbetalinger", () => {
    beforeEach(() => {
        // Mock current date to November 18, 2025
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-11-18"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('chip: "kommende"', () => {
        it("inkluderer kun PLANLAGT_UTBETALING og STOPPET statuser med fremtidig forfallsdato", () => {
            const utbetalinger = [
                utb({
                    status: UtbetalingDtoStatus.PLANLAGT_UTBETALING,
                    forfallsdato: "2025-11-25",
                    referanse: "planlagt",
                }),
                utb({ status: UtbetalingDtoStatus.STOPPET, forfallsdato: "2025-11-30", referanse: "stoppet" }),
                utb({ status: UtbetalingDtoStatus.UTBETALT, forfallsdato: "2025-11-25", referanse: "utbetalt" }),
                utb({ status: UtbetalingDtoStatus.ANNULLERT, forfallsdato: "2025-11-25", referanse: "annullert" }),
            ];

            const result = filtrerUtbetalinger("kommende", utbetalinger);

            expect(result).toHaveLength(2);
            expect(result?.map((u) => u.referanse)).toEqual(["planlagt", "stoppet"]);
        });

        it("filtrerer bort utbetalinger med forfallsdato i fortiden", () => {
            const utbetalinger = [
                utb({
                    status: UtbetalingDtoStatus.PLANLAGT_UTBETALING,
                    forfallsdato: "2025-11-17",
                    referanse: "gammel",
                }),
                utb({
                    status: UtbetalingDtoStatus.PLANLAGT_UTBETALING,
                    forfallsdato: "2025-11-25",
                    referanse: "fremtidig",
                }),
            ];

            const result = filtrerUtbetalinger("kommende", utbetalinger);

            expect(result).toHaveLength(1);
            expect(result?.[0].referanse).toBe("fremtidig");
        });

        it("filtrerer bort utbetalinger uten forfallsdato", () => {
            const utbetalinger = [
                utb({
                    status: UtbetalingDtoStatus.PLANLAGT_UTBETALING,
                    forfallsdato: undefined,
                    referanse: "uten-dato",
                }),
                utb({
                    status: UtbetalingDtoStatus.PLANLAGT_UTBETALING,
                    forfallsdato: "2025-11-25",
                    referanse: "med-dato",
                }),
            ];

            const result = filtrerUtbetalinger("kommende", utbetalinger);

            expect(result).toHaveLength(1);
            expect(result?.[0].referanse).toBe("med-dato");
        });

        it("returnerer tom array når ingen utbetalinger matcher", () => {
            const utbetalinger = [
                utb({ status: UtbetalingDtoStatus.UTBETALT, forfallsdato: "2025-11-25" }),
                utb({ status: UtbetalingDtoStatus.PLANLAGT_UTBETALING, forfallsdato: "2025-11-01" }),
            ];

            const result = filtrerUtbetalinger("kommende", utbetalinger);

            expect(result).toEqual([]);
        });
    });

    describe('chip: "egendefinert"', () => {
        it("filtrerer utbetalinger innenfor valgt intervall", () => {
            const utbetalinger = [
                utb({ utbetalingsdato: "2025-09-15", referanse: "september" }),
                utb({ utbetalingsdato: "2025-10-20", referanse: "oktober" }),
                utb({ utbetalingsdato: "2025-11-05", referanse: "november" }),
            ];

            const selectedRange = interval(new Date("2025-10-01"), new Date("2025-10-31"));
            const result = filtrerUtbetalinger("egendefinert", utbetalinger, selectedRange);

            expect(result).toHaveLength(1);
            expect(result?.[0].referanse).toBe("oktober");
        });

        it("returnerer null når ingen intervall er gitt", () => {
            const utbetalinger = [utb({ utbetalingsdato: "2025-10-20" })];

            const result = filtrerUtbetalinger("egendefinert", utbetalinger);

            expect(result).toBeNull();
        });

        it("bruker forfallsdato når utbetalingsdato mangler", () => {
            const utbetalinger = [
                utb({ utbetalingsdato: undefined, forfallsdato: "2025-10-15", referanse: "innenfor" }),
                utb({ utbetalingsdato: undefined, forfallsdato: "2025-09-15", referanse: "utenfor" }),
            ];

            const selectedRange = interval(new Date("2025-10-01"), new Date("2025-10-31"));
            const result = filtrerUtbetalinger("egendefinert", utbetalinger, selectedRange);

            expect(result).toHaveLength(1);
            expect(result?.[0].referanse).toBe("innenfor");
        });
    });

    describe('chip: "siste3"', () => {
        it("filtrerer utbetalinger fra siste 3 måneder med UTBETALT eller STOPPET status", () => {
            const utbetalinger = [
                utb({ status: UtbetalingDtoStatus.UTBETALT, utbetalingsdato: "2025-11-10", referanse: "nov-utbetalt" }),
                utb({ status: UtbetalingDtoStatus.STOPPET, utbetalingsdato: "2025-10-15", referanse: "okt-stoppet" }),
                utb({
                    status: UtbetalingDtoStatus.PLANLAGT_UTBETALING,
                    utbetalingsdato: "2025-11-10",
                    referanse: "nov-planlagt",
                }),
                utb({
                    status: UtbetalingDtoStatus.UTBETALT,
                    utbetalingsdato: "2025-07-10",
                    referanse: "juli-utbetalt",
                }),
            ];

            const result = filtrerUtbetalinger("siste3", utbetalinger);

            expect(result).toHaveLength(2);
            expect(result?.map((u) => u.referanse)).toEqual(["nov-utbetalt", "okt-stoppet"]);
        });

        it("filtrerer bort PLANLAGT_UTBETALING status", () => {
            const utbetalinger = [
                utb({ status: UtbetalingDtoStatus.PLANLAGT_UTBETALING, utbetalingsdato: "2025-11-10" }),
                utb({ status: UtbetalingDtoStatus.UTBETALT, utbetalingsdato: "2025-11-10", referanse: "utbetalt" }),
            ];

            const result = filtrerUtbetalinger("siste3", utbetalinger);

            expect(result).toHaveLength(1);
            expect(result?.[0].referanse).toBe("utbetalt");
        });
    });

    describe('chip: "hittil"', () => {
        it("filtrerer utbetalinger hittil i år med UTBETALT eller STOPPET status", () => {
            const utbetalinger = [
                utb({ status: UtbetalingDtoStatus.UTBETALT, utbetalingsdato: "2025-01-15", referanse: "januar" }),
                utb({ status: UtbetalingDtoStatus.STOPPET, utbetalingsdato: "2025-06-20", referanse: "juni" }),
                utb({ status: UtbetalingDtoStatus.UTBETALT, utbetalingsdato: "2024-12-20", referanse: "fjor" }),
                utb({
                    status: UtbetalingDtoStatus.PLANLAGT_UTBETALING,
                    utbetalingsdato: "2025-05-10",
                    referanse: "planlagt",
                }),
            ];

            const result = filtrerUtbetalinger("hittil", utbetalinger);

            expect(result).toHaveLength(2);
            expect(result?.map((u) => u.referanse)).toEqual(["januar", "juni"]);
        });
    });

    describe('chip: "fjor"', () => {
        it("filtrerer utbetalinger fra fjoråret med UTBETALT eller STOPPET status", () => {
            const utbetalinger = [
                utb({ status: UtbetalingDtoStatus.UTBETALT, utbetalingsdato: "2024-03-15", referanse: "mars-2024" }),
                utb({ status: UtbetalingDtoStatus.STOPPET, utbetalingsdato: "2024-09-20", referanse: "sept-2024" }),
                utb({ status: UtbetalingDtoStatus.UTBETALT, utbetalingsdato: "2025-01-15", referanse: "i-år" }),
                utb({
                    status: UtbetalingDtoStatus.UTBETALT,
                    utbetalingsdato: "2023-12-20",
                    referanse: "for-lenge-siden",
                }),
            ];

            const result = filtrerUtbetalinger("fjor", utbetalinger);

            expect(result).toHaveLength(2);
            expect(result?.map((u) => u.referanse)).toEqual(["mars-2024", "sept-2024"]);
        });
    });

    describe("edge cases", () => {
        it("returnerer tom array for tom input", () => {
            const result = filtrerUtbetalinger("kommende", []);
            expect(result).toEqual([]);
        });

        it("håndterer utbetalinger med kun utbetalingsdato for kommende", () => {
            const utbetalinger = [
                utb({
                    status: UtbetalingDtoStatus.PLANLAGT_UTBETALING,
                    utbetalingsdato: "2025-11-25",
                    forfallsdato: undefined,
                }),
            ];

            const result = filtrerUtbetalinger("kommende", utbetalinger);

            expect(result).toEqual([]); // Kommende krever forfallsdato
        });
    });
});
