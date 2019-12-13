import {UtbetalingSakType} from "./service/useUtbetalingerService";

// Example: getRandomInt(3) => expected output: 0, 1 or 2
export const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * Math.floor(max));
};

export const mockUtbetalinger: UtbetalingSakType[] = [
    {
        "ar": 2019,
        "maned": "november",
        "foersteIManeden": "2019-11-01",
        "sum": 3000.0,
        "utbetalinger": [
            {
                "tittel": "Reiseutgifter",
                "belop": 700.0,
                "utbetalingsdato": "2019-11-01",
                "status": "UTBETALT",
                "fiksDigisosId": "589b9683-2868-4957-9a5e-b2b744a9a905"
            },
            {
                "tittel": "Livshopphold",
                "belop": 2200.0,
                "utbetalingsdato": "2019-11-01",
                "status": "UTBETALT",
                "fiksDigisosId": "589b9683-2868-4957-9a5e-b2b744a9a905"
            }
        ]
    },
    {
        "ar": 2019,
        "maned": "august",
        "foersteIManeden": "2019-07-01",
        "sum": 11000.0,
        "utbetalinger": [{
            "tittel": "Nødhjelp",
            "belop": 11000.0,
            "utbetalingsdato": "2019-07-01",
            "status": "UTBETALT",
            "fiksDigisosId": "589b9683-2868-4957-9a5e-b2b744a9a905"
        }]
    },
    {
        "ar": 2019,
        "maned": "juni",
        "foersteIManeden": "2019-06-01",
        "sum": 10000.0,
        "utbetalinger": [{
            "tittel": "Nødhjelp",
            "belop": 10000.0,
            "utbetalingsdato": "2019-06-01",
            "status": "UTBETALT",
            "fiksDigisosId": "589b9683-2868-4957-9a5e-b2b744a9a905"
        }]
    },
    {
        "ar": 2019,
        "maned": "mai",
        "foersteIManeden": "2019-05-01",
        "sum": 11000.0,
        "utbetalinger": [{
            "tittel": "Nødhjelp",
            "belop": 11000.0,
            "utbetalingsdato": "2019-05-01",
            "status": "UTBETALT",
            "fiksDigisosId": "589b9683-2868-4957-9a5e-b2b744a9a905"
        }]
    },

    {
        "ar": 2019,
        "maned": "april",
        "foersteIManeden": "2019-04-01",
        "sum": 9000.0,
        "utbetalinger": [{
            "tittel": "Nødhjelp",
            "belop": 9000.0,
            "utbetalingsdato": "2019-04-01",
            "status": "UTBETALT",
            "fiksDigisosId": "589b9683-2868-4957-9a5e-b2b744a9a905"
        }]
    },
    {
        "ar": 2019,
        "maned": "mars",
        "foersteIManeden": "2019-03-01",
        "sum": 7000.0,
        "utbetalinger": [{
            "tittel": "Nødhjelp",
            "belop": 7000.0,
            "utbetalingsdato": "2019-03-01",
            "status": "UTBETALT",
            "fiksDigisosId": "589b9683-2868-4957-9a5e-b2b744a9a905"
        }]
    },


];
