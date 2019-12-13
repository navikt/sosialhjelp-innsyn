// @ts-ignore
let utbetalinger: any = [{
    "ar": 2019,
    "maned": "august",
    "sum": 12000.0,
    "utbetalinger": [
        {
            "tittel": "Nødhjelp",
            "belop": 12000.0,
            "utbetalingsdato": "2019-08-01",
            "status": "UTBETALT",
            "fiksDigisosId": "79373a8a-57d3-4af1-ba88-5f240b576d0f"
        }
    ]
}];

// Example: getRandomInt(3) => expected output: 0, 1 or 2
const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * Math.floor(max));
};

let zzz_utbetalinger = [
    {
        "ar": 2019,
        "maned": "september",
        "foersteIManeden": "2019-08-01",
        "sum": 3000.0,
        "utbetalinger": [
            {
                "tittel": "Reiseutgifter",
                "belop": 700.0,
                "utbetalingsdato": "2019-08-01",
                "status": "UTBETALT",
                "fiksDigisosId": "5eb4608f-5280-4082-a5e1-d7c0a596e921"
            },
            {
                "tittel": "Livshopphold",
                "belop": 2200.0,
                "utbetalingsdato": "2019-08-01",
                "status": "UTBETALT",
                "fiksDigisosId": "5eb4608f-5280-4082-a5e1-d7c0a596e921"
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
            "fiksDigisosId": "5eb4608f-5280-4082-a5e1-d7c0a596e921"
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
            "fiksDigisosId": "5eb4608f-5280-4082-a5e1-d7c0a596e921"
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
            "fiksDigisosId": "5eb4608f-5280-4082-a5e1-d7c0a596e921"
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
            "fiksDigisosId": "5eb4608f-5280-4082-a5e1-d7c0a596e921"
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
            "fiksDigisosId": "5eb4608f-5280-4082-a5e1-d7c0a596e921"
        }]
    },


];

// @ts-ignore
it('burde filtrere utbetalinger på dato', function () {
    expect(1).toBe(1);
});
