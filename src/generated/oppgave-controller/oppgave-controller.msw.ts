/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {faker} from "@faker-js/faker";
import {HttpResponse, delay, http} from "msw";

export const getGetVilkarMock = () =>
    Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => ({
        beskrivelse: faker.helpers.arrayElement([faker.word.sample(), undefined]),
        hendelsetidspunkt: faker.date.past().toISOString().split("T")[0],
        status: faker.helpers.arrayElement([
            "RELEVANT",
            "ANNULLERT",
            "OPPFYLT",
            "IKKE_OPPFYLT",
            "LEVERT_TIDLIGERE",
        ] as const),
        tittel: faker.helpers.arrayElement([faker.word.sample(), undefined]),
        utbetalingsReferanse: faker.helpers.arrayElement([
            Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => faker.word.sample()),
            undefined,
        ]),
        vilkarReferanse: faker.word.sample(),
    }));

export const getGetOppgaverMock = () =>
    Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => ({
        innsendelsesfrist: faker.helpers.arrayElement([faker.date.past().toISOString().split("T")[0], undefined]),
        oppgaveElementer: Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => ({
            dokumenttype: faker.word.sample(),
            erFraInnsyn: faker.datatype.boolean(),
            hendelsereferanse: faker.helpers.arrayElement([faker.word.sample(), undefined]),
            hendelsetype: faker.helpers.arrayElement([
                faker.helpers.arrayElement([
                    "dokumentasjonEtterspurt",
                    "dokumentasjonkrav",
                    "soknad",
                    "bruker",
                ] as const),
                undefined,
            ]),
            tilleggsinformasjon: faker.helpers.arrayElement([faker.word.sample(), undefined]),
        })),
        oppgaveId: faker.word.sample(),
    }));

export const getGetOppgaveMedIdMock = () =>
    Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => ({
        innsendelsesfrist: faker.helpers.arrayElement([faker.date.past().toISOString().split("T")[0], undefined]),
        oppgaveElementer: Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => ({
            dokumenttype: faker.word.sample(),
            erFraInnsyn: faker.datatype.boolean(),
            hendelsereferanse: faker.helpers.arrayElement([faker.word.sample(), undefined]),
            hendelsetype: faker.helpers.arrayElement([
                faker.helpers.arrayElement([
                    "dokumentasjonEtterspurt",
                    "dokumentasjonkrav",
                    "soknad",
                    "bruker",
                ] as const),
                undefined,
            ]),
            tilleggsinformasjon: faker.helpers.arrayElement([faker.word.sample(), undefined]),
        })),
        oppgaveId: faker.word.sample(),
    }));

export const getGetHarLevertDokumentasjonkravMock = () => faker.datatype.boolean();

export const getGetfagsystemHarDokumentasjonkravMock = () => faker.datatype.boolean();

export const getGetDokumentasjonkravMock = () =>
    Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => ({
        dokumentasjonkravElementer: Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(
            () => ({
                beskrivelse: faker.helpers.arrayElement([faker.word.sample(), undefined]),
                dokumentasjonkravReferanse: faker.word.sample(),
                hendelsetidspunkt: faker.date.past().toISOString().split("T")[0],
                hendelsetype: faker.helpers.arrayElement([
                    faker.helpers.arrayElement([
                        "dokumentasjonEtterspurt",
                        "dokumentasjonkrav",
                        "soknad",
                        "bruker",
                    ] as const),
                    undefined,
                ]),
                status: faker.helpers.arrayElement([
                    "RELEVANT",
                    "ANNULLERT",
                    "OPPFYLT",
                    "IKKE_OPPFYLT",
                    "LEVERT_TIDLIGERE",
                ] as const),
                tittel: faker.helpers.arrayElement([faker.word.sample(), undefined]),
                utbetalingsReferanse: faker.helpers.arrayElement([
                    Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() =>
                        faker.word.sample()
                    ),
                    undefined,
                ]),
            })
        ),
        dokumentasjonkravId: faker.word.sample(),
        frist: faker.helpers.arrayElement([faker.date.past().toISOString().split("T")[0], undefined]),
    }));

export const getGetDokumentasjonkravMedIdMock = () =>
    Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => ({
        dokumentasjonkravElementer: Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(
            () => ({
                beskrivelse: faker.helpers.arrayElement([faker.word.sample(), undefined]),
                dokumentasjonkravReferanse: faker.word.sample(),
                hendelsetidspunkt: faker.date.past().toISOString().split("T")[0],
                hendelsetype: faker.helpers.arrayElement([
                    faker.helpers.arrayElement([
                        "dokumentasjonEtterspurt",
                        "dokumentasjonkrav",
                        "soknad",
                        "bruker",
                    ] as const),
                    undefined,
                ]),
                status: faker.helpers.arrayElement([
                    "RELEVANT",
                    "ANNULLERT",
                    "OPPFYLT",
                    "IKKE_OPPFYLT",
                    "LEVERT_TIDLIGERE",
                ] as const),
                tittel: faker.helpers.arrayElement([faker.word.sample(), undefined]),
                utbetalingsReferanse: faker.helpers.arrayElement([
                    Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() =>
                        faker.word.sample()
                    ),
                    undefined,
                ]),
            })
        ),
        dokumentasjonkravId: faker.word.sample(),
        frist: faker.helpers.arrayElement([faker.date.past().toISOString().split("T")[0], undefined]),
    }));

export const getOppgaveControllerMock = () => [
    http.get("*/api/v1/innsyn/:fiksDigisosId/vilkar", async () => {
        await delay(1000);
        return new HttpResponse(JSON.stringify(getGetVilkarMock()), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }),
    http.get("*/api/v1/innsyn/:fiksDigisosId/oppgaver", async () => {
        await delay(1000);
        return new HttpResponse(JSON.stringify(getGetOppgaverMock()), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }),
    http.get("*/api/v1/innsyn/:fiksDigisosId/oppgaver/:oppgaveId", async () => {
        await delay(1000);
        return new HttpResponse(JSON.stringify(getGetOppgaveMedIdMock()), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }),
    http.get("*/api/v1/innsyn/:fiksDigisosId/harLeverteDokumentasjonkrav", async () => {
        await delay(1000);
        return new HttpResponse(JSON.stringify(getGetHarLevertDokumentasjonkravMock()), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }),
    http.get("*/api/v1/innsyn/:fiksDigisosId/fagsystemHarDokumentasjonkrav", async () => {
        await delay(1000);
        return new HttpResponse(JSON.stringify(getGetfagsystemHarDokumentasjonkravMock()), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }),
    http.get("*/api/v1/innsyn/:fiksDigisosId/dokumentasjonkrav", async () => {
        await delay(1000);
        return new HttpResponse(JSON.stringify(getGetDokumentasjonkravMock()), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }),
    http.get("*/api/v1/innsyn/:fiksDigisosId/dokumentasjonkrav/:dokumentasjonkravId", async () => {
        await delay(1000);
        return new HttpResponse(JSON.stringify(getGetDokumentasjonkravMedIdMock()), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }),
];
