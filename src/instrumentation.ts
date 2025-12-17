/* eslint-disable @typescript-eslint/no-require-imports */

import { logger } from "@navikt/next-logger";

export async function register(): Promise<void> {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        await require("pino");
        await import("@navikt/next-logger");
        await require("next-logger");

        // Start MSW server for e2e tests
        if (process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "e2e") {
            const { e2eServer } = await import("./mocks/e2eServer");
            e2eServer.listen({
                onUnhandledRequest(request) {
                    if (
                        !request.url.includes("dekoratoren.ekstern.dev.nav.no") &&
                        (request.url.includes("/api/") || request.url.includes("/sosialhjelp/"))
                    ) {
                        logger.warn(`⚠️  MSW: Unhandled request: ${request.method} ${request.url}`);
                    }
                },
            });
            logger.info("🔶 MSW e2e server started for testing environment");
        }
    }
}
