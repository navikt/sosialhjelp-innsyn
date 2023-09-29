import {UtbetalingerResponse} from "../generated/model";

// Example: getRandomInt(3) => expected output: 0, 1 or 2
const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * Math.floor(max));
};

const summerAntallUtbetalinger = (utbetalingerMaaned: UtbetalingerResponse[]) => {
    let antallUtbetalinger: number = 0;
    utbetalingerMaaned.map((utbetalingMaaned: UtbetalingerResponse) => {
        antallUtbetalinger = antallUtbetalinger + utbetalingMaaned.utbetalinger.length;
        return utbetalingMaaned;
    });
    return antallUtbetalinger;
};

const mockUtbetalinger: (UtbetalingerResponse & {sum: number})[] = [
    {
        ar: 2019,
        maned: 10,
        foersteIManeden: "2019-10-01",
        sum: 13234.0,
        utbetalinger: [
            {
                tittel: "Utbetaling til søker",
                belop: 1234.0,
                utbetalingsdato: "2019-08-20",
                status: "ANNULLERT",
                fiksDigisosId: "ce3f24a0-359e-45f3-a7f7-5123e70cb715",
                fom: "2019-09-01",
                tom: "2019-09-30",
                mottaker: "søkers fnr",
                annenMottaker: true,
                kontonummer: "11223344556",
                forfallsdato: "2019-08-20",
                utbetalingsmetode: "bankoverføring",
            },
            {
                tittel: "Utbetaling til utleier - husleie",
                belop: 12000.0,
                utbetalingsdato: "2019-08-01",
                status: "UTBETALT",
                fiksDigisosId: "ce3f24a0-359e-45f3-a7f7-5123e70cb715",
                mottaker: "Utleier",
                annenMottaker: true,
                forfallsdato: "2019-08-20",
                utbetalingsmetode: "bankoverføring",
            },
        ],
    },
    {
        ar: 2019,
        maned: 9,
        foersteIManeden: "2019-09-01",
        sum: 0.0,
        utbetalinger: [
            {
                tittel: "Annullert utbetaling",
                belop: 1234.0,
                utbetalingsdato: "2019-09-04",
                status: "ANNULLERT",
                fiksDigisosId: "ce3f24a0-359e-45f3-a7f7-5123e70cb715",
                fom: "2019-09-01",
                tom: "2019-10-31",
                mottaker: "søkers fnr",
                annenMottaker: false,
                forfallsdato: "2019-08-20",
                utbetalingsmetode: "bankoverføring",
            },
        ],
    },
    {
        ar: 2018,
        maned: 8,
        foersteIManeden: "2019-08-01",
        sum: 13234.0,
        utbetalinger: [
            {
                tittel: "Utbetaling til søker",
                belop: 1234.0,
                utbetalingsdato: "2019-08-20",
                status: "UTBETALT",
                fiksDigisosId: "ce3f24a0-359e-45f3-a7f7-5123e70cb715",
                fom: "2019-09-01",
                tom: "2019-09-30",
                mottaker: "19066711222",
                annenMottaker: false,
                kontonummer: "11223344556",
                forfallsdato: "2019-08-20",
                utbetalingsmetode: "bankoverføring",
            },
            {
                tittel: "Utbetaling til utleier - husleie",
                belop: 12000.0,
                utbetalingsdato: "2019-08-01",
                status: "UTBETALT",
                fiksDigisosId: "ce3f24a0-359e-45f3-a7f7-5123e70cb715",
                mottaker: "Utleier",
                annenMottaker: false,
                forfallsdato: "2019-08-20",
                utbetalingsmetode: "bankoverføring",
            },
        ],
    },
];

export {mockUtbetalinger, getRandomInt, summerAntallUtbetalinger};
