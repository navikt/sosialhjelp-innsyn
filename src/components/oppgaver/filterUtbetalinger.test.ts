import {filterUtbetalinger, SaksUtbetaling} from "./Oppgaver";

test("Utbetalingsperioden er forbigått med 21 dager og er utbetalt, vilkår/dok.krav filtreres bort", () => {
    const utbetalingsReferanser = ["abc"];
    const saksutbetalinger: SaksUtbetaling = {
        abc: {
            fom: "2022-02-04",
            tom: "2022-03-01",
            utbetalingsreferanse: "abc",
            status: "UTBETALT",
        },
    };
    const todaysDate = new Date("2022-03-22");
    const filtrerteUtbetalinger = filterUtbetalinger(utbetalingsReferanser, saksutbetalinger, todaysDate);
    expect(filtrerteUtbetalinger).toBe(false);
});

test("Utbetalingsperioden er ikke forbigått med 21 dager og er utbetalt, vilkår/dok.krav vises fortsatt", () => {
    const utbetalingsReferanser = ["abc"];
    const saksutbetalinger: SaksUtbetaling = {
        abc: {
            fom: "2022-02-04",
            tom: "2022-03-15",
            utbetalingsreferanse: "abc",
            status: "UTBETALT",
        },
    };
    const todaysDate = new Date("2022-03-22");
    const filtrerteUtbetalinger = filterUtbetalinger(utbetalingsReferanser, saksutbetalinger, todaysDate);
    expect(filtrerteUtbetalinger).toBe(true);
});

test("Utbetalingsperioden er forbigått med 21 dager for en utbetaling, vilkår/dok.krav med utb.ref", () => {
    const utbetalingsReferanser = ["abc", "def"];
    const saksutbetalinger: SaksUtbetaling = {
        abc: {
            fom: "2022-02-04",
            tom: "2022-03-01",
            utbetalingsreferanse: "abc",
            status: "UTBETALT",
        },
        def: {
            fom: "2022-02-04",
            tom: "2022-03-15",
            utbetalingsreferanse: "def",
            status: "UTBETALT",
        },
    };
    const todaysDate = new Date("2022-03-22");
    const filtrerteUtbetalinger = filterUtbetalinger(utbetalingsReferanser, saksutbetalinger, todaysDate);
    expect(filtrerteUtbetalinger).toBe(true);
});

test("vilkår/dok.krav uten urb.ref blir ikke filtrert bort", () => {
    const utbetalingsReferanser: string[] = [];
    const saksutbetalinger: SaksUtbetaling = {
        abc: {
            fom: "2022-02-04",
            tom: "2022-03-01",
            utbetalingsreferanse: "",
            status: "UTBETALT",
        },
    };
    const todaysDate = new Date("2022-03-23");
    const filtrerteUtbetalinger = filterUtbetalinger(utbetalingsReferanser, saksutbetalinger, todaysDate);
    expect(filtrerteUtbetalinger).toBe(true);
});
