import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

import { getGetSaksDetaljerResponseMock } from "../generated/saks-oversikt-controller/saks-oversikt-controller.msw";

/**
 * E2E-specific MSW server with no delays for faster tests.
 * Default handlers return empty/minimal data, tests can override via /api/test/msw
 */
export const e2eServer = setupServer(
    // Saker endpoint - return empty by default
    http.get("*/api/v1/innsyn/saker", async () => {
        return HttpResponse.json([], { status: 200 });
    }),

    // Utbetalinger endpoint - return empty by default
    http.get("*/api/v2/innsyn/utbetalinger", async () => {
        return HttpResponse.json([], { status: 200 });
    }),

    // Tilgang endpoint - return access granted
    http.get("*/api/v1/innsyn/tilgang", async () => {
        return HttpResponse.json({ harTilgang: true }, { status: 200 });
    }),

    // Sak detaljer endpoint
    http.get("*/api/v1/innsyn/sak/:fiksDigisosId/detaljer", async () => {
        return HttpResponse.json(getGetSaksDetaljerResponseMock(), { status: 200 });
    })

    // Add other commonly used endpoints as needed
);
