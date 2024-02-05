// @ts-ignore
import {mockUtbetalinger, summerAntallUtbetalinger} from "./Utbetalinger.testdata";
import {filtrerUtbetalingerForTidsinterval, filtrerUtbetalingerPaaMottaker} from "./utbetalingerUtils";
import {UtbetalingerResponse} from "../generated/model";
import {erDetteAapnet} from "./beta/tabs/UtbetalingAccordionItem";

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
    expect(erDetteAapnet(new Date("2024-01-14"), "2023-12-27")).toBe(false);
    /** jan til feb - 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28|29|30 31 02 - jan til feb */
    //                00 01 02 03 04 05 06 07 08 09 10 11 12 13 14|15|16 17 18 - dager
    /** jan til des - 14 13 12 11 10 09 08 07 06 05 04 03 02 01 31|30|29 28 27 - dato tilbake - jan til des*/
});

it("Utbetalingsdetaljer skal ikke være åpen når utbetalingsdato er 16 dager tilbake i tid", () => {
    expect(erDetteAapnet(new Date("2024-01-14"), "2023-12-29")).toBe(false);
    /** jan til feb - 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28|29|30 31 02 - jan til feb */
    //                00 01 02 03 04 05 06 07 08 09 10 11 12 13 14|15|16 17 18 - dager
    /** jan til des - 14 13 12 11 10 09 08 07 06 05 04 03 02 01 31|30|29 28 27 - dato tilbake - jan til des*/
});

it("Utbetalingsdetaljer skal være åpen når utbetalingsdato er 15 dager tilbake i tid", () => {
    expect(erDetteAapnet(new Date("2024-01-14"), "2023-12-30")).toBe(true);
    /** jan til feb - 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28|29|30 31 02 - jan til feb */
    //                00 01 02 03 04 05 06 07 08 09 10 11 12 13 14|15|16 17 18 - dager
    /** jan til des - 14 13 12 11 10 09 08 07 06 05 04 03 02 01 31|30|29 28 27 - dato tilbake - jan til des*/
});

it("Utbetalingsdetaljer skal være åpen når utbetalingsdato er 14 dager tilbake i tid", () => {
    expect(erDetteAapnet(new Date("2024-01-14"), "2023-12-31")).toBe(true);
    /** jan til feb - 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28|29|30 31 02 - jan til feb */
    //                00 01 02 03 04 05 06 07 08 09 10 11 12 13 14|15|16 17 18 - dager
    /** jan til des - 14 13 12 11 10 09 08 07 06 05 04 03 02 01 31|30|29 28 27 - dato tilbake - jan til des*/
});

it("Utbetalingsdetaljer skal være åpen når utbetalingsdato er dags dato", () => {
    expect(erDetteAapnet(new Date("2024-01-14"), "2024-01-14")).toBe(true);
    /** jan til feb - 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28|29|30 31 02 - jan til feb */
    //                00 01 02 03 04 05 06 07 08 09 10 11 12 13 14|15|16 17 18 - dager
    /** jan til des - 14 13 12 11 10 09 08 07 06 05 04 03 02 01 31|30|29 28 27 - dato tilbake - jan til des*/
});

it("Utbetalingsdetaljer skal være åpen når utbetalingsdato er 14 dager frem i tid", () => {
    expect(erDetteAapnet(new Date("2024-01-14"), "2024-01-28")).toBe(true);
    /** jan til feb - 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28|29|30 31 02 - jan til feb */
    //                00 01 02 03 04 05 06 07 08 09 10 11 12 13 14|15|16 17 18 - dager
    /** jan til des - 14 13 12 11 10 09 08 07 06 05 04 03 02 01 31|30|29 28 27 - dato tilbake - jan til des*/
});

it("Utbetalingsdetaljer skal være åpen når utbetalingsdato er 15 dager frem i tid", () => {
    expect(erDetteAapnet(new Date("2024-01-14"), "2024-01-29")).toBe(false); //skal være true
    /** jan til feb - 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28|29|30 31 02 - jan til feb */
    //                00 01 02 03 04 05 06 07 08 09 10 11 12 13 14|15|16 17 18 - dager
    /** jan til des - 14 13 12 11 10 09 08 07 06 05 04 03 02 01 31|30|29 28 27 - dato tilbake - jan til des*/
});

it("Utbetalingsdetaljer skal ikke være åpen når utbetalingsdato er 16 dager frem i tid", () => {
    expect(erDetteAapnet(new Date("2024-01-14"), "2024-01-30")).toBe(false);
    /** jan til feb - 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28|29|30 31 02 - jan til feb */
    //                00 01 02 03 04 05 06 07 08 09 10 11 12 13 14|15|16 17 18 - dager
    /** jan til des - 14 13 12 11 10 09 08 07 06 05 04 03 02 01 31|30|29 28 27 - dato tilbake - jan til des*/
});

it("Utbetalingsdetaljer skal ikke være åpen når utbetalingsdato er 18 dager frem i tid", () => {
    expect(erDetteAapnet(new Date("2024-01-14"), "2024-02-02")).toBe(false);
    /** jan til feb - 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28|29|30 31 02 - jan til feb */
    //                00 01 02 03 04 05 06 07 08 09 10 11 12 13 14|15|16 17 18 - dager
    /** jan til des - 14 13 12 11 10 09 08 07 06 05 04 03 02 01 31|30|29 28 27 - dato tilbake - jan til des*/
});

it("Utbetalingsdetaljer skal ikke være åpen når utbetalingsdato ikke er definert", () => {
    expect(erDetteAapnet(new Date("2024-01-14"), "")).toBe(false);
});
