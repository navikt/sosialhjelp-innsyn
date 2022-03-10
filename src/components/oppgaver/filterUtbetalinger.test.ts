import {filterUtbetalinger, SaksUtbetaling} from "./Oppgaver";

test("Skal filtrere utbetalinger eldre enn 21 dager", () => {
    const utbetalingsReferanser = ["abc"];
    const saksutbetalinger: SaksUtbetaling = {
        abc: {
            fom: "2022-02-04",
            tom: "2022-03-04",
            utbetlingsreferanse: "abc",
            status: "UTBETALT",
        },
    };
    const todaysDate = new Date("2022-04-04");
    const filtrerteUtbetalinger = filterUtbetalinger(utbetalingsReferanser, saksutbetalinger, todaysDate);
    expect(filtrerteUtbetalinger).toBe(false);
});
