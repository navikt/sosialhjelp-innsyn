/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {faker} from "@faker-js/faker";
import {HttpResponse, delay, http} from "msw";

export const getHentSaksStatuserMock = () =>
    Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => ({
        skalViseVedtakInfoPanel: faker.datatype.boolean(),
        status: faker.helpers.arrayElement([
            faker.helpers.arrayElement([
                "UNDER_BEHANDLING",
                "IKKE_INNSYN",
                "FERDIGBEHANDLET",
                "BEHANDLES_IKKE",
                "FEILREGISTRERT",
            ] as const),
            undefined,
        ]),
        tittel: faker.word.sample(),
        vedtaksfilUrlList: faker.helpers.arrayElement([
            Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => ({
                dato: faker.helpers.arrayElement([faker.date.past().toISOString().split("T")[0], undefined]),
                id: faker.word.sample(),
                url: faker.word.sample(),
            })),
            undefined,
        ]),
    }));

export const getSaksStatusControllerMock = () => [
    http.get("*/api/v1/innsyn/:fiksDigisosId/saksStatus", async () => {
        await delay(1000);
        return new HttpResponse(JSON.stringify(getHentSaksStatuserMock()), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }),
];
