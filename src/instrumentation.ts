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
                    // Log unhandled requests to help debug
                    if (request.url.includes("/api/")) {
                        logger.warn(`⚠️  MSW: Unhandled API request: ${request.method} ${request.url}`);
                    }
                },
            });
            logger.warn("🔶 MSW e2e server started.");
        }
    }
}
