import { NextRequest, NextResponse } from "next/server";
import { http, HttpResponse } from "msw";

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
        e2eServer.resetHandlers();
        return NextResponse.json({ success: true });
    }

    // Use wildcard pattern to match MSW handler format
    const pattern = endpoint.startsWith("*/") ? endpoint : `*${endpoint}`;
    e2eServer.use(
        http.get(pattern, async () => {
            return HttpResponse.json(response, { status: 200 });
        })
    );

    return NextResponse.json({ success: true });
}
