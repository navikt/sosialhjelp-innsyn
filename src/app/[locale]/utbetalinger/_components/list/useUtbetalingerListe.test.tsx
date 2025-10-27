import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import {
    ManedUtbetalingStatus,
    type ManedUtbetaling,
    type NyeOgTidligereUtbetalingerResponse,
} from "@generated/ssr/model";
import {
    getHentNyeUtbetalingerMockHandler,
    getHentTidligereUtbetalingerMockHandler,
} from "@generated/utbetalinger-controller/utbetalinger-controller.msw";

import { server } from "../../../../../mocks/server";

import { useUtbetalinger } from "./useUtbetalingerListe";

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

describe("FiltreringAvUtbetalinger (updated for hook)", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
    });

    afterEach(() => {
        vi.useRealTimers();
        queryClient.clear();
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    it("Kommende: inkluderer PLANLAGT_UTBETALING og STOPPET fra 'nye' og ignorerer 'tidligere'", async () => {
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

        server.use(
            getHentNyeUtbetalingerMockHandler(nye, { once: true }),
            getHentTidligereUtbetalingerMockHandler(tidligere, { once: true })
        );

        const { result } = renderHook(() => useUtbetalinger({ selectedState: { chip: "kommende" } }), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current).toHaveLength(1);
        });

        const datas = result.current as NyeOgTidligereUtbetalingerResponse[];
        expect(datas[0].maned).toBe(10);
        expect(datas[0].utbetalingerForManed.map((u) => u.referanse)).toEqual(["ny-planlagt", "ny-stoppet"]);
    });

    it("Hittil i år: tar UTBETALT/STOPPET fra både 'nye' og 'tidligere' innen intervallet, filtrerer bort PLANLAGT", async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
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

        server.use(
            getHentNyeUtbetalingerMockHandler(nye, { once: true }),
            getHentTidligereUtbetalingerMockHandler(tidligere, { once: true })
        );

        const { result } = renderHook(() => useUtbetalinger({ selectedState: { chip: "hittil" } }), { wrapper });

        await waitFor(() => {
            expect(result.current.length).toBeGreaterThan(0);
        });

        const periodeUtbetalinger = result.current as NyeOgTidligereUtbetalingerResponse[];
        expect(periodeUtbetalinger.map((g) => g.maned)).toEqual([9, 10]);

        const sept = periodeUtbetalinger.find((g) => g.maned === 9)!;
        const okt = periodeUtbetalinger.find((g) => g.maned === 10)!;

        expect(sept.utbetalingerForManed.map((u) => u.referanse)).toEqual(["tidligere-stoppet"]);
        expect(okt.utbetalingerForManed.map((u) => u.referanse)).toEqual(["ny-utbetalt"]);

        vi.useRealTimers();
    });

    it("Siste 3 mnd: håndterer årsskifte korrekt (nov 2024..jan 2025 når 'i dag' er 10. jan 2025)", async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(new Date(2025, 0, 10));

        const data = [
            gruppe(2024, 11, [
                utb({
                    status: ManedUtbetalingStatus.UTBETALT,
                    referanse: "nov24",
                    utbetalingsdato: "2024-11-21",
                }),
            ]),
            gruppe(2024, 12, [
                utb({
                    status: ManedUtbetalingStatus.UTBETALT,
                    referanse: "des24",
                    utbetalingsdato: "2024-12-24",
                }),
            ]),
            gruppe(2025, 1, [
                utb({
                    status: ManedUtbetalingStatus.UTBETALT,
                    referanse: "jan25",
                    utbetalingsdato: "2025-01-09",
                }),
            ]),
            gruppe(2024, 10, [
                utb({
                    status: ManedUtbetalingStatus.UTBETALT,
                    referanse: "okt24",
                    utbetalingsdato: "2024-10-31",
                }),
            ]),
        ];

        server.use(
            getHentNyeUtbetalingerMockHandler([], { once: true }),
            getHentTidligereUtbetalingerMockHandler(data, { once: true })
        );

        const { result } = renderHook(() => useUtbetalinger({ selectedState: { chip: "siste3" } }), { wrapper });

        await waitFor(() => {
            expect(result.current.length).toBeGreaterThan(0);
        });

        const periode = result.current as NyeOgTidligereUtbetalingerResponse[];
        expect(periode.map((g) => [g.ar, g.maned])).toEqual([
            [2024, 11],
            [2024, 12],
            [2025, 1],
        ]);
        expect(periode.flatMap((g) => g.utbetalingerForManed.map((u) => u.referanse))).toEqual([
            "nov24",
            "des24",
            "jan25",
        ]);

        vi.useRealTimers();
    });

    it("Egendefinert: matcher enkeltdato (utbetalingsdato/forfallsdato) og ikke periode", async () => {
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

        server.use(
            getHentNyeUtbetalingerMockHandler([], { once: true }),
            getHentTidligereUtbetalingerMockHandler(komb, { once: true })
        );

        const { result } = renderHook(
            () =>
                useUtbetalinger({
                    selectedState: {
                        chip: "egendefinert",
                        interval: { start: new Date("2025-09-01"), end: new Date("2025-09-30") },
                    },
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.length).toBeGreaterThan(0);
        });

        const egendefinertUtbetalinger = result.current as NyeOgTidligereUtbetalingerResponse[];
        expect(egendefinertUtbetalinger).toHaveLength(1);
        const [sept] = egendefinertUtbetalinger;
        expect(sept.maned).toBe(9);
        expect(sept.utbetalingerForManed.map((u) => u.referanse).sort()).toEqual(["innenfor-utbetalingsdato"].sort());
    });

    it("Egendefinert: returnerer tom liste når valgtDatointervall er null", async () => {
        server.use(
            getHentNyeUtbetalingerMockHandler([], { once: true }),
            getHentTidligereUtbetalingerMockHandler([], { once: true })
        );

        const { result } = renderHook(
            () =>
                useUtbetalinger({
                    selectedState: { chip: "egendefinert", interval: undefined },
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current).toEqual([]);
        });
    });
});
