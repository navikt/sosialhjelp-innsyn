import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import {
    ManedUtbetalingStatus,
    type ManedUtbetaling,
    type NyeOgTidligereUtbetalingerResponse,
} from "@generated/ssr/model";

import { filtreringAvUtbetalinger } from "./useUtbetalingerListe";

const utb = (overrides: Partial<ManedUtbetaling> = {}): ManedUtbetaling => ({
    referanse: "ref",
    tittel: "Livsopphold",
    belop: 1000,
    status: ManedUtbetalingStatus.PLANLAGT_UTBETALING,
    fiksDigisosId: "fiks-1",
    utbetalingsdato: "2025-10-10",
    forfallsdato: "2025-10-11",
    fom: "2025-10-01",
    tom: "2025-10-31",
    mottaker: "Standard",
    annenMottaker: false,
    kontonummer: "12345678901",
    utbetalingsmetode: "BANKKONTO",
    ...overrides,
});

const gruppe = (
    ar: number,
    maned: number,
    utbetalingerForManed: ManedUtbetaling[]
): NyeOgTidligereUtbetalingerResponse => ({
    ar,
    maned,
    utbetalingerForManed,
});

describe("FiltreringAvUtbetalinger", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("Kommende: inkluderer PLANLAGT_UTBETALING og STOPPET fra 'nye' og ignorerer 'tidligere'", () => {
        const nye = [
            gruppe(2025, 10, [
                utb({ status: ManedUtbetalingStatus.PLANLAGT_UTBETALING, referanse: "ny-planlagt" }),
                utb({ status: ManedUtbetalingStatus.STOPPET, referanse: "ny-stoppet" }),
                utb({ status: ManedUtbetalingStatus.UTBETALT, referanse: "ny-utbetalt" }),
            ]),
        ];
        const tidligere = [
            gruppe(2025, 9, [utb({ status: ManedUtbetalingStatus.STOPPET, referanse: "tidligere-stoppet" })]),
        ];

        const { kommendeUtbetalinger, periodeUtbetalinger, egendefinertUtbetalinger } = filtreringAvUtbetalinger({
            valgteChip: "kommende.kort",
            nye,
            tidligere,
            valgtDatoRekke: null,
        });

        expect(kommendeUtbetalinger).toHaveLength(1);
        expect(kommendeUtbetalinger[0].maned).toBe(10);
        expect(kommendeUtbetalinger[0].utbetalingerForManed.map((utbetaling) => utbetaling.referanse)).toEqual([
            "ny-planlagt",
            "ny-stoppet",
        ]);

        expect(periodeUtbetalinger).toEqual([]);
        expect(egendefinertUtbetalinger).toEqual([]);
    });

    it("Hittil i år: tar UTBETALT/STOPPET fra både 'nye' og 'tidligere' innen intervallet, filtrerer bort PLANLAGT", () => {
        vi.setSystemTime(new Date(2025, 9, 15));

        const nye = [
            gruppe(2025, 10, [
                utb({ status: ManedUtbetalingStatus.UTBETALT, referanse: "ny-utbetalt" }),
                utb({ status: ManedUtbetalingStatus.PLANLAGT_UTBETALING, referanse: "ny-planlagt" }),
            ]),
        ];
        const tidligere = [
            gruppe(2025, 9, [utb({ status: ManedUtbetalingStatus.STOPPET, referanse: "tidligere-stoppet" })]),
        ];

        const { periodeUtbetalinger } = filtreringAvUtbetalinger({
            valgteChip: "hittil",
            nye,
            tidligere,
            valgtDatoRekke: null,
        });

        expect(periodeUtbetalinger.map((gruppe) => gruppe.maned)).toEqual([9, 10]);

        const sept = periodeUtbetalinger.find((gruppe) => gruppe.maned === 9)!;
        const okt = periodeUtbetalinger.find((gruppe) => gruppe.maned === 10)!;

        expect(sept.utbetalingerForManed.map((utbetaling) => utbetaling.referanse)).toEqual(["tidligere-stoppet"]);
        expect(okt.utbetalingerForManed.map((utbetaling) => utbetaling.referanse)).toEqual(["ny-utbetalt"]);
    });

    it("Siste 3 mnd: håndterer årsskifte korrekt (nov 2024..jan 2025 når 'i dag' er 10. jan 2025)", () => {
        vi.setSystemTime(new Date(2025, 0, 10));

        const data = [
            gruppe(2024, 11, [utb({ status: ManedUtbetalingStatus.UTBETALT, referanse: "nov24" })]),
            gruppe(2024, 12, [utb({ status: ManedUtbetalingStatus.UTBETALT, referanse: "des24" })]),
            gruppe(2025, 1, [utb({ status: ManedUtbetalingStatus.UTBETALT, referanse: "jan25" })]),
            gruppe(2024, 10, [utb({ status: ManedUtbetalingStatus.UTBETALT, referanse: "okt24" })]),
        ];

        const { periodeUtbetalinger } = filtreringAvUtbetalinger({
            valgteChip: "siste3",
            nye: [],
            tidligere: data,
            valgtDatoRekke: null,
        });

        expect(periodeUtbetalinger.map((gruppe) => [gruppe.ar, gruppe.maned])).toEqual([
            [2024, 11],
            [2024, 12],
            [2025, 1],
        ]);
        expect(
            periodeUtbetalinger.flatMap((gruppe) =>
                gruppe.utbetalingerForManed.map((utbetaling) => utbetaling.referanse)
            )
        ).toEqual(["nov24", "des24", "jan25"]);
    });

    it("Egendefinert: matcher enten enkeltdato (utbetalingsdato/forfallsdato) eller overlapp i fom–tom", () => {
        const komb = [
            gruppe(2025, 9, [
                utb({
                    referanse: "innenfor-utbetalingsdato",
                    utbetalingsdato: "2025-09-15",
                    forfallsdato: undefined,
                }),
                utb({
                    referanse: "utenfor-utbetalingsdato",
                    utbetalingsdato: "2025-08-31",
                    forfallsdato: undefined,
                }),
                utb({
                    referanse: "overlapper-periode",
                    utbetalingsdato: undefined,
                    forfallsdato: undefined,
                    fom: "2025-08-25",
                    tom: "2025-09-05",
                }),
                utb({
                    referanse: "utenfor-periode",
                    utbetalingsdato: undefined,
                    forfallsdato: undefined,
                    fom: "2025-10-01",
                    tom: "2025-10-10",
                }),
            ]),
        ];

        const { egendefinertUtbetalinger } = filtreringAvUtbetalinger({
            valgteChip: "egendefinert",
            nye: [],
            tidligere: komb,
            valgtDatoRekke: { from: new Date("2025-09-01"), to: new Date("2025-09-30") },
        });

        expect(egendefinertUtbetalinger).toHaveLength(1);
        const [sept] = egendefinertUtbetalinger;
        expect(sept.maned).toBe(9);
        expect(sept.utbetalingerForManed.map((utbetaling) => utbetaling.referanse).sort()).toEqual(
            ["innenfor-utbetalingsdato", "overlapper-periode"].sort()
        );
    });

    it("Egendefinert: returnerer tom liste når valgtDatoRekke er null", () => {
        const { egendefinertUtbetalinger } = filtreringAvUtbetalinger({
            valgteChip: "egendefinert",
            nye: [],
            tidligere: [],
            valgtDatoRekke: null,
        });
        expect(egendefinertUtbetalinger).toEqual([]);
    });
});
