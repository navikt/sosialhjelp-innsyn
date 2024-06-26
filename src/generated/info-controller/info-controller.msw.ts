/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {HttpResponse, delay, http} from "msw";

export const getPostKlientloggMockHandler = () => {
    return http.post("*/api/v1/info/logg", async () => {
        await delay(1000);
        return new HttpResponse(null, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    });
};
export const getInfoControllerMock = () => [getPostKlientloggMockHandler()];
