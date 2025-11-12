import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import { UtbetalingDtoStatus, type UtbetalingDto } from "@generated/model";
import { getHentUtbetalingerMockHandler } from "@generated/utbetalinger-controller-2/utbetalinger-controller-2.msw";

import { server } from "../../../../../mocks/server";

import { useUtbetalinger } from "./useUtbetalingerListe";

const utb = (overrides: Partial<UtbetalingDto> = {}): UtbetalingDto => ({
    referanse: "ref",
    tittel: "Livsopphold",
    belop: 1000,
    status: UtbetalingDtoStatus.PLANLAGT_UTBETALING,
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

describe("FiltreringAvUtbetalinger (updated for new flat list endpoint)", () => {
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

    it("Kommende: inkluderer kun PLANLAGT_UTBETALING og STOPPET statuser", async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(new Date(2025, 9, 15)); // 15. oktober 2025
        const alleUtbetalinger = [
            utb({
                status: UtbetalingDtoStatus.PLANLAGT_UTBETALING,
                referanse: "planlagt",
                forfallsdato: "2025-10-15",
            }),
            utb({ status: UtbetalingDtoStatus.STOPPET, referanse: "stoppet", forfallsdato: "2025-10-20" }),
            utb({ status: UtbetalingDtoStatus.UTBETALT, referanse: "utbetalt", utbetalingsdato: "2025-10-05" }),
        ];

        server.use(getHentUtbetalingerMockHandler(alleUtbetalinger, { once: true }));

        const { result } = renderHook(() => useUtbetalinger({ selectedState: { chip: "kommende" } }), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.data).toHaveLength(1);
        });

        const { data } = result.current;
        expect(data[0].maned).toBe(10);
        expect(data[0].utbetalinger.map((u) => u.referanse)).toEqual(["planlagt", "stoppet"]);
    });

    it("Hittil i år: tar UTBETALT/STOPPET innen intervallet, filtrerer bort PLANLAGT", async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(new Date(2025, 9, 15)); // 15. oktober 2025

        const alleUtbetalinger = [
            utb({ status: UtbetalingDtoStatus.UTBETALT, referanse: "utbetalt-okt", utbetalingsdato: "2025-10-10" }),
            utb({
                status: UtbetalingDtoStatus.PLANLAGT_UTBETALING,
                referanse: "planlagt-okt",
                utbetalingsdato: "2025-10-20",
            }),
            utb({ status: UtbetalingDtoStatus.STOPPET, referanse: "stoppet-sept", utbetalingsdato: "2025-09-15" }),
            utb({ status: UtbetalingDtoStatus.UTBETALT, referanse: "utbetalt-jan", utbetalingsdato: "2025-01-10" }),
        ];

        server.use(getHentUtbetalingerMockHandler(alleUtbetalinger, { once: true }));

        const { result } = renderHook(() => useUtbetalinger({ selectedState: { chip: "hittil" } }), { wrapper });

        await waitFor(() => {
            expect(result.current.data.length).toBeGreaterThan(0);
        });

        const periodeUtbetalinger = result.current.data;
        expect(periodeUtbetalinger.map((g) => g.maned)).toEqual([1, 9, 10]);

        const jan = periodeUtbetalinger.find((g) => g.maned === 1)!;
        const sept = periodeUtbetalinger.find((g) => g.maned === 9)!;
        const okt = periodeUtbetalinger.find((g) => g.maned === 10)!;

        expect(jan.utbetalinger.map((u) => u.referanse)).toEqual(["utbetalt-jan"]);
        expect(sept.utbetalinger.map((u) => u.referanse)).toEqual(["stoppet-sept"]);
        expect(okt.utbetalinger.map((u) => u.referanse)).toEqual(["utbetalt-okt"]);

        vi.useRealTimers();
    });

    it("Siste 3 mnd: håndterer årsskifte korrekt (nov 2024..jan 2025 når 'i dag' er 10. jan 2025)", async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(new Date(2025, 0, 10)); // 10. januar 2025

        const alleUtbetalinger = [
            utb({
                status: UtbetalingDtoStatus.UTBETALT,
                referanse: "nov24",
                utbetalingsdato: "2024-11-21",
            }),
            utb({
                status: UtbetalingDtoStatus.UTBETALT,
                referanse: "des24",
                utbetalingsdato: "2024-12-24",
            }),
            utb({
                status: UtbetalingDtoStatus.UTBETALT,
                referanse: "jan25",
                utbetalingsdato: "2025-01-09",
            }),
            utb({
                status: UtbetalingDtoStatus.UTBETALT,
                referanse: "okt24",
                utbetalingsdato: "2024-10-31",
            }),
        ];

        server.use(getHentUtbetalingerMockHandler(alleUtbetalinger, { once: true }));

        const { result } = renderHook(() => useUtbetalinger({ selectedState: { chip: "siste3" } }), { wrapper });

        await waitFor(() => {
            expect(result.current.data.length).toBeGreaterThan(0);
        });

        const periode = result.current.data;
        expect(periode.map((g) => [g.ar, g.maned])).toEqual([
            [2024, 10],
            [2024, 11],
            [2024, 12],
            [2025, 1],
        ]);
        expect(periode.flatMap((g) => g.utbetalinger.map((u) => u.referanse))).toEqual([
            "okt24",
            "nov24",
            "des24",
            "jan25",
        ]);

        vi.useRealTimers();
    });

    it("Egendefinert: matcher enkeltdato (utbetalingsdato/forfallsdato) og ikke periode", async () => {
        const alleUtbetalinger = [
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
        ];

        server.use(getHentUtbetalingerMockHandler(alleUtbetalinger, { once: true }));

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
            expect(result.current.data.length).toBeGreaterThan(0);
        });

        const egendefinertUtbetalinger = result.current.data;
        expect(egendefinertUtbetalinger).toHaveLength(1);
        const [sept] = egendefinertUtbetalinger;
        expect(sept.maned).toBe(9);
        expect(sept.utbetalinger.map((u) => u.referanse).sort()).toEqual(["innenfor-utbetalingsdato"].sort());
    });

    it("Egendefinert: returnerer tom liste når valgtDatointervall er null", async () => {
        server.use(getHentUtbetalingerMockHandler([], { once: true }));

        const { result } = renderHook(
            () =>
                useUtbetalinger({
                    selectedState: { chip: "egendefinert", interval: undefined },
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.data).toEqual([]);
        });
    });
});
