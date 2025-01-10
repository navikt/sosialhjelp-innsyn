import { filterUtbetalinger, skalSkjuleVilkarOgDokKrav, UtbetalingerResponse } from "./Oppgaver";

const utbetaltOver21Dager: UtbetalingerResponse = {
    tom: "2022-01-30",
    status: "UTBETALT",
};

const utbetaltUnder21Dager: UtbetalingerResponse = {
    tom: "2022-03-30",
    status: "UTBETALT",
};

const annullertUtbetalingOver21Dager: UtbetalingerResponse = {
    tom: "2022-01-30",
    status: "ANNULLERT",
};

const annullertUtbetalingUnder21Dager: UtbetalingerResponse = {
    tom: "2022-03-30",
    status: "ANNULLERT",
};

const planlagtUtbetalting: UtbetalingerResponse = {
    tom: "2022-03-30",
    status: "PLANLAGT_UTBETALING",
};

const stoppetUtbetaling: UtbetalingerResponse = {
    tom: "2022-03-30",
    status: "ANNULLERT",
};

const todaysDate = new Date("2022-04-01");

test("skal være false hvis ingen utbetalinger", () => {
    const utbetalinger: UtbetalingerResponse[] = [];
    const filrerteUtbetalinger: UtbetalingerResponse[] = [];

    expect(skalSkjuleVilkarOgDokKrav(utbetalinger, filrerteUtbetalinger)).toBe(false);
});

test("skal være false hvis utbetalinger ikke har samme størrelse som filtrerteUtbetalinger", () => {
    const utbetalinger: UtbetalingerResponse[] = [utbetaltOver21Dager];
    const filrerteUtbetalinger: UtbetalingerResponse[] = [];

    expect(skalSkjuleVilkarOgDokKrav(utbetalinger, filrerteUtbetalinger)).toBe(false);
});

test("skal være true hvis utbetalinger har samme størrelse som filtrerteUtbetalinger", () => {
    const utbetalinger: UtbetalingerResponse[] = [utbetaltOver21Dager];
    const filrerteUtbetalinger: UtbetalingerResponse[] = [utbetaltOver21Dager];

    expect(skalSkjuleVilkarOgDokKrav(utbetalinger, filrerteUtbetalinger)).toBe(true);
});

test("skal retunere utbetalte utbetalinger med tom-dato eldre enn 21 dager", () => {
    const utbetalinger: UtbetalingerResponse[] = [utbetaltOver21Dager];
    const filtrerteUtbetalinger = filterUtbetalinger(utbetalinger, todaysDate);

    expect(filtrerteUtbetalinger[0]).toBe(utbetaltOver21Dager);
});

test("skal ikke retunere utbetalte utbetalinger med tom-dato nyere enn 21 dager", () => {
    const utbetalinger: UtbetalingerResponse[] = [utbetaltUnder21Dager];
    const filtrerteUtbetalinger = filterUtbetalinger(utbetalinger, todaysDate);

    expect(filtrerteUtbetalinger.length).toBe(0);
});

test("skal retunere utbetalinger som har status utbetalt/annullert og har tom-dato eldre enn 21 dager", () => {
    const utbetalinger: UtbetalingerResponse[] = [
        utbetaltOver21Dager,
        utbetaltUnder21Dager,
        annullertUtbetalingOver21Dager,
        annullertUtbetalingUnder21Dager,
        planlagtUtbetalting,
        stoppetUtbetaling,
    ];
    const filtrerteUtbetalinger = filterUtbetalinger(utbetalinger, todaysDate);

    expect(filtrerteUtbetalinger.includes(utbetaltOver21Dager)).toBe(true);
    expect(filtrerteUtbetalinger.includes(annullertUtbetalingOver21Dager)).toBe(true);
    expect(filtrerteUtbetalinger.length).toBe(2);
});
