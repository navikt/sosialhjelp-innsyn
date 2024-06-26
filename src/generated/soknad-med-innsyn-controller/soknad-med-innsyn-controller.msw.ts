/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {faker} from "@faker-js/faker";
import {HttpResponse, delay, http} from "msw";

export const getHarSoknaderMedInnsynResponseMock = (): boolean => faker.datatype.boolean();

export const getHarSoknaderMedInnsynMockHandler = (overrideResponse?: boolean) => {
    return http.get("*/api/v1/innsyn/harSoknaderMedInnsyn", async () => {
        await delay(1000);
        return new HttpResponse(
            JSON.stringify(overrideResponse ? overrideResponse : getHarSoknaderMedInnsynResponseMock()),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    });
};
export const getSoknadMedInnsynControllerMock = () => [getHarSoknaderMedInnsynMockHandler()];
