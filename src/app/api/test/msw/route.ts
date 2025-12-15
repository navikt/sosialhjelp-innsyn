import { NextRequest, NextResponse } from "next/server";
import { http, HttpResponse } from "msw";
import { logger } from "@navikt/next-logger";

import { e2eServer } from "../../../../mocks/e2eServer";

// Only allow this endpoint in test/e2e environments
const isTestEnvironment = ["test", "e2e", "local"].includes(process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT || "");

export async function POST(request: NextRequest) {
    if (!isTestEnvironment) {
        return NextResponse.json({ error: "Not allowed in this environment" }, { status: 403 });
    }

    const body = await request.json();
    const { endpoint, response } = body;

    if (endpoint === "reset") {
        logger.info("[MSW] Resetting all mock handlers");
        e2eServer.resetHandlers();
        return NextResponse.json({ success: true });
    }

    // Use wildcard pattern to match MSW handler format
    const pattern = endpoint.startsWith("*/") ? endpoint : `*${endpoint}`;
    const cleanPath = pattern.replace("*/", "");
    logger.info(`[MSW] Mocking: ${cleanPath}`);

    // Add handler using e2eServer.use() - this should take precedence over default handlers
    const runtimeHandler = http.get(pattern, async () => {
        return HttpResponse.json(response, { status: 200 });
    });

    e2eServer.use(runtimeHandler);

    return NextResponse.json({ success: true });
}
