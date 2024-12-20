/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {faker} from "@faker-js/faker";
import {HttpResponse, delay, http} from "msw";
import type {OppgaveOpplastingResponse, VedleggResponse} from ".././model";

export const getHentVedleggResponseMock = (): VedleggResponse[] =>
    Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => ({
        datoLagtTil: `${faker.date.past().toISOString().split(".")[0]}Z`,
        filnavn: faker.word.sample(),
        storrelse: faker.number.int({min: undefined, max: undefined}),
        tilleggsinfo: faker.helpers.arrayElement([faker.word.sample(), undefined]),
        type: faker.word.sample(),
        url: faker.word.sample(),
    }));

export const getSendVedleggResponseMock = (): OppgaveOpplastingResponse[] =>
    Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => ({
        filer: Array.from({length: faker.number.int({min: 1, max: 10})}, (_, i) => i + 1).map(() => ({
            filnavn: faker.helpers.arrayElement([faker.word.sample(), undefined]),
            status: faker.helpers.arrayElement([
                "OK",
                "COULD_NOT_LOAD_DOCUMENT",
                "PDF_IS_ENCRYPTED",
                "ILLEGAL_FILE_TYPE",
                "ILLEGAL_FILENAME",
                "FILE_TOO_LARGE",
            ] as const),
        })),
        hendelsereferanse: faker.helpers.arrayElement([faker.word.sample(), undefined]),
        hendelsetype: faker.helpers.arrayElement([
            faker.helpers.arrayElement(["dokumentasjonEtterspurt", "dokumentasjonkrav", "soknad", "bruker"] as const),
            undefined,
        ]),
        innsendelsesfrist: faker.helpers.arrayElement([faker.date.past().toISOString().split("T")[0], undefined]),
        tilleggsinfo: faker.helpers.arrayElement([faker.word.sample(), undefined]),
        type: faker.word.sample(),
    }));

export const getHentVedleggMockHandler = (
    overrideResponse?:
        | VedleggResponse[]
        | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<VedleggResponse[]> | VedleggResponse[])
) => {
    return http.get("*/api/v1/innsyn/:fiksDigisosId/vedlegg", async (info) => {
        await delay(1000);

        return new HttpResponse(
            JSON.stringify(
                overrideResponse !== undefined
                    ? typeof overrideResponse === "function"
                        ? await overrideResponse(info)
                        : overrideResponse
                    : getHentVedleggResponseMock()
            ),
            {status: 200, headers: {"Content-Type": "application/json"}}
        );
    });
};

export const getSendVedleggMockHandler = (
    overrideResponse?:
        | OppgaveOpplastingResponse[]
        | ((
              info: Parameters<Parameters<typeof http.post>[1]>[0]
          ) => Promise<OppgaveOpplastingResponse[]> | OppgaveOpplastingResponse[])
) => {
    return http.post("*/api/v1/innsyn/:fiksDigisosId/vedlegg", async (info) => {
        await delay(1000);

        return new HttpResponse(
            JSON.stringify(
                overrideResponse !== undefined
                    ? typeof overrideResponse === "function"
                        ? await overrideResponse(info)
                        : overrideResponse
                    : getSendVedleggResponseMock()
            ),
            {status: 200, headers: {"Content-Type": "application/json"}}
        );
    });
};
export const getVedleggControllerMock = () => [getHentVedleggMockHandler(), getSendVedleggMockHandler()];
