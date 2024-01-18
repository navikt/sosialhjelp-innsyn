// @ts-ignore
import {mockUtbetalinger, summerAntallUtbetalinger} from "./Utbetalinger.testdata";
import {filtrerUtbetalingerForTidsinterval, filtrerUtbetalingerPaaMottaker} from "./utbetalingerUtils";
import {UtbetalingerResponse} from "../generated/model";
//import {erDetteAapnet} from "./beta/tabs/UtbetalingAccordionItem";

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

//it("Utbetalingsdetaljer skal være lukket når utbetalingsdato er 16 dager tilbake i tid", () => {
//    expect(erDetteAapnet(new Date("2024-01-14"), new Date("2023-12-30"))).toBe(false);
//});

//it("Utbetalingsdetaljer skal være åpnet når utbetalingsdato er 15 dager tilbake i tid", () => {
//    expect(erDetteAapnet(new Date("2024-01-14"), new Date("2023-12-31"))).toBe(true);
//});

//it("Utbetalingsdetaljer skal være åpnet når utbetalingsdato er 15 dager frem i tid", () => {
//    expect(erDetteAapnet(new Date("2024-01-14"), new Date("2024-01-29"))).toBe(true);
//});

//it("Utbetalingsdetaljer skal være lukket når utbetalingsdato er 16 dager frem i tid", () => {
//    expect(erDetteAapnet(new Date("2024-01-14"), new Date("2024-01-30"))).toBe(false);
//});
