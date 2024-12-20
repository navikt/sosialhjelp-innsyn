/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {faker} from "@faker-js/faker";
import {HttpResponse, delay, http} from "msw";

export const getFilOpplastingResponseMock = (): string => faker.word.sample();

export const getOppdaterDigisosSakResponseMock = (): string => faker.word.sample();

export const getGetInnsynsfilResponseMock = (): string => faker.word.sample();

export const getFilOpplastingMockHandler = (
    overrideResponse?: string | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<string> | string)
) => {
    return http.post("*/api/v1/digisosapi/:fiksDigisosId/filOpplasting", async (info) => {
        await delay(1000);

        return new HttpResponse(
            JSON.stringify(
                overrideResponse !== undefined
                    ? typeof overrideResponse === "function"
                        ? await overrideResponse(info)
                        : overrideResponse
                    : getFilOpplastingResponseMock()
            ),
            {status: 200, headers: {"Content-Type": "application/json"}}
        );
    });
};

export const getOppdaterDigisosSakMockHandler = (
    overrideResponse?: string | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<string> | string)
) => {
    return http.post("*/api/v1/digisosapi/oppdaterDigisosSak", async (info) => {
        await delay(1000);

        return new HttpResponse(
            JSON.stringify(
                overrideResponse !== undefined
                    ? typeof overrideResponse === "function"
                        ? await overrideResponse(info)
                        : overrideResponse
                    : getOppdaterDigisosSakResponseMock()
            ),
            {status: 200, headers: {"Content-Type": "application/json"}}
        );
    });
};

export const getGetInnsynsfilMockHandler = (
    overrideResponse?: string | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<string> | string)
) => {
    return http.get("*/api/v1/digisosapi/:digisosId/innsynsfil", async (info) => {
        await delay(1000);

        return new HttpResponse(
            JSON.stringify(
                overrideResponse !== undefined
                    ? typeof overrideResponse === "function"
                        ? await overrideResponse(info)
                        : overrideResponse
                    : getGetInnsynsfilResponseMock()
            ),
            {status: 200, headers: {"Content-Type": "application/json"}}
        );
    });
};
export const getDigisosApiTestControllerMock = () => [
    getFilOpplastingMockHandler(),
    getOppdaterDigisosSakMockHandler(),
    getGetInnsynsfilMockHandler(),
];
