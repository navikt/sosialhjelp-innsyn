/**
 * Generated by orval v6.19.1 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {faker} from "@faker-js/faker";
import {rest} from "msw";

export const getHarSoknaderMedInnsynMock = () => faker.datatype.boolean();

export const getSoknadMedInnsynControllerMSW = () => [
    rest.get("*/api/v1/innsyn/harSoknaderMedInnsyn", (_req, res, ctx) => {
        return res(ctx.delay(1000), ctx.status(200, "Mocked status"), ctx.json(getHarSoknaderMedInnsynMock()));
    }),
];