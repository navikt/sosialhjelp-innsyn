// @ts-ignore
import {mockUtbetalinger, summerAntallUtbetalinger} from "./Utbetalinger.testdata";
import {UtbetalingerResponse} from "../generated/model";
import {filtrerUtbetalingerForTidsinterval, filtrerUtbetalingerPaaMottaker} from "./utbetalingerUtils";
import {utbetalingsdetaljerDefaultAapnet} from "./beta/tabs/UtbetalingAccordionItem";

it("should filter by time interval", () => {
    const utbetalingerMaaned: UtbetalingerResponse[] = mockUtbetalinger;
    expect(utbetalingerMaaned.length).toBe(3);
    const now: Date = new Date("2019-12-01");
    expect(filtrerUtbetalingerForTidsinterval(utbetalingerMaaned, 6, now).length).toBe(3);
});

it("should filter by receiver of money", () => {
    const utbetalingerMaaned: UtbetalingerResponse[] = mockUtbetalinger;
    expect(summerAntallUtbetalinger(utbetalingerMaaned)).toBe(5);
    expect(summerAntallUtbetalinger(filtrerUtbetalingerPaaMottaker(utbetalingerMaaned, true, false))).toBe(3);
    expect(summerAntallUtbetalinger(filtrerUtbetalingerPaaMottaker(utbetalingerMaaned, false, false))).toBe(0);
    expect(summerAntallUtbetalinger(filtrerUtbetalingerPaaMottaker(utbetalingerMaaned, false, true))).toBe(2);
});

it("Utbetalingsdetaljer skal ikke være åpen når utbetalingsdato er 18 dager tilbake i tid", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2023-12-27")).toBe(false);
});

it("Utbetalingsdetaljer skal være lukket når utbetalingsdato er 16 dager tilbake i tid, datoer samme måned", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-20"), "2024-01-04")).toBe(false);
});

it("Utbetalingsdetaljer skal ikke være åpen når utbetalingsdato er 16 dager tilbake i tid", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2023-12-29")).toBe(false);
});

it("Utbetalingsdetaljer skal være åpen når utbetalingsdato er 15 dager tilbake i tid, datoer samme måned", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-20"), "2024-01-05")).toBe(true);
});

it("Utbetalingsdetaljer skal være åpen når utbetalingsdato er 15 dager tilbake i tid", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2023-12-30")).toBe(true);
});

it("Utbetalingsdetaljer skal være åpen når utbetalingsdato er 14 dager tilbake i tid", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2023-12-31")).toBe(true);
});

it("Utbetalingsdetaljer skal være åpen når utbetalingsdato er dags dato", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2024-01-14")).toBe(true);
});

it("Utbetalingsdetaljer skal være åpen når utbetalingsdato er 14 dager frem i tid", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2024-01-28")).toBe(true);
});

it("Utbetalingsdetaljer skal være åpen når utbetalingsdato er 15 dager frem i tid", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2024-01-29")).toBe(true);
});

it("Utbetalingsdetaljer skal ikke være åpen når utbetalingsdato er 16 dager frem i tid", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2024-01-30")).toBe(false);
});

it("Utbetalingsdetaljer skal ikke være åpen når utbetalingsdato er 18 dager frem i tid", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2024-02-02")).toBe(false);
});

it("Utbetalingsdetaljer skal ikke være åpen når utbetalingsdato er 18 dager frem i tid", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2024-02-02")).toBe(false);
});
it("Utbetalingsdetaljer skal ikke være åpen når utbetalingsdato ikke er definert", () => {
    expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "")).toBe(false);
});
