// @ts-ignore
import {mockUtbetalinger, summerAntallUtbetalinger} from "./Utbetalinger.testdata";
import {filtrerUtbetalingerForTidsinterval, filtrerUtbetalingerPaaMottaker} from "./utbetalingerUtils";
import {UtbetalingSakType} from "./service/useUtbetalingerService";

it("should filter by time interval", () => {
    const utbetalingerMaaned: UtbetalingSakType[] = mockUtbetalinger;
    expect(utbetalingerMaaned.length).toBe(3);
    const now: Date = new Date("2019-12-01");
    expect(filtrerUtbetalingerForTidsinterval(utbetalingerMaaned, 6, now).length).toBe(3);
});

it("should filter by receiver of money", () => {
    const utbetalingerMaaned: UtbetalingSakType[] = mockUtbetalinger;
    expect(summerAntallUtbetalinger(utbetalingerMaaned)).toBe(5);
    expect(summerAntallUtbetalinger(filtrerUtbetalingerPaaMottaker(utbetalingerMaaned, true, false))).toBe(3);
    expect(summerAntallUtbetalinger(filtrerUtbetalingerPaaMottaker(utbetalingerMaaned, false, false))).toBe(0);
    expect(summerAntallUtbetalinger(filtrerUtbetalingerPaaMottaker(utbetalingerMaaned, false, true))).toBe(2);
});
