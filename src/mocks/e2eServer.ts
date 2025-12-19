import { setupServer } from "msw/node";
import type { SetupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { logger } from "@navikt/next-logger";
import { getGetSaksDetaljerResponseMock } from "@generated/saks-oversikt-controller/saks-oversikt-controller.msw";

/**
 * E2E-specific MSW server with no delays for faster tests.
 * Using globalThis ensures the same server instance is used across all module imports,
 * which is necessary for e2eServer.use() to work properly in Next.js.
 */

declare global {
    var __E2E_MSW_SERVER__: SetupServer | undefined;
}

const getE2eServer = (): SetupServer => {
    if (!globalThis.__E2E_MSW_SERVER__) {
        globalThis.__E2E_MSW_SERVER__ = setupServer(
            // Saker endpoint - return empty by default
            http.get("*/api/v1/innsyn/saker", async () => {
                logger.warn("[MSW] ⚠️  Using default handler for /api/v1/innsyn/saker - consider mocking in your test");
                return HttpResponse.json([], { status: 200 });
            }),

            // Utbetalinger endpoint - return empty by default
            http.get("*/api/v2/innsyn/utbetalinger", async () => {
                logger.warn(
                    "[MSW] ⚠️  Using default handler for /api/v2/innsyn/utbetalinger - consider mocking in your test"
                );
                return HttpResponse.json([], { status: 200 });
            }),

            // Tilgang endpoint - return access granted
            http.get("*/api/v1/innsyn/tilgang", async () => {
                logger.warn(
                    "[MSW] ⚠️  Using default handler for /api/v1/innsyn/tilgang - consider mocking in your test"
                );
                return HttpResponse.json({ harTilgang: true, fornavn: "Test" }, { status: 200 });
            }),

            // Sak detaljer endpoint
            http.get("*/api/v1/innsyn/sak/:fiksDigisosId/detaljer", async ({ params }) => {
                logger.warn(
                    `[MSW] ⚠️  Using default handler for /api/v1/innsyn/sak/${params.fiksDigisosId}/detaljer - consider mocking in your test`
                );
                return HttpResponse.json(getGetSaksDetaljerResponseMock(), { status: 200 });
            }),

            // Paabegynte soknader endpoint
            http.get("*/dittnav/pabegynte/aktive", async () => {
                logger.warn(
                    "[MSW] ⚠️  Using default handler for /dittnav/pabegynte/aktive - consider mocking in your test"
                );
                return HttpResponse.json([], { status: 200 });
            }),

            // Klager endpoint
            http.get("*/api/v1/innsyn/klager", async () => {
                logger.warn(
                    "[MSW] ⚠️  Using default handler for /api/v1/innsyn/klager - consider mocking in your test"
                );
                return HttpResponse.json([], { status: 200 });
            }),

            // HarSoknaderMedInnsyn endpoint
            http.get("*/api/v1/innsyn/harSoknaderMedInnsyn", async () => {
                logger.warn(
                    "[MSW] ⚠️  Using default handler for /api/v1/innsyn/harSoknaderMedInnsyn - consider mocking in your test"
                );
                return HttpResponse.json(false, { status: 200 });
            }),

            // Kommune endpoint
            http.get("*/api/v1/innsyn/kommuner/:kommuneNr", async ({ params }) => {
                logger.warn(
                    `[MSW] ⚠️  Using default handler for /api/v1/innsyn/kommuner/${params.kommuneNr} - consider mocking in your test`
                );
                return HttpResponse.json({ kommuneNavn: "Test Kommune" }, { status: 200 });
            })
        );
    }
    return globalThis.__E2E_MSW_SERVER__;
};

export const e2eServer = getE2eServer();
