import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@i18n/routing";
import { getFlag, getToggles, UNLEASH_COOKIE_NAME } from "@featuretoggles/unleash";

const rewrite = async (request: NextRequest) => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_landingsside", await getToggles());
    // Eksempel: /nb -> ['', 'nb'], segments = []
    const [, , ...segments] = request.nextUrl.pathname.split("/");
    if (toggle.enabled && segments.length === 0) {
        return NextResponse.rewrite(request.nextUrl.href + "/landingsside");
    }
};

export async function middleware(request: NextRequest) {
    const i18nMiddleware = createMiddleware(routing);

    const response = i18nMiddleware(request);
    if (request.cookies.get(UNLEASH_COOKIE_NAME)?.value == null) {
        response.cookies.set(UNLEASH_COOKIE_NAME, crypto.randomUUID());
    }
    // Hvis bruker må redirectes for språket, så blir det satt som en 3XX, dvs. !ok.
    if (response && !response.ok) {
        return response;
    }
    return rewrite(request);
}

export const config = {
    matcher: ["/sosialhjelp/innsyn/(nb|nn|en)/:path*", "/:path*", "/(nb|nn|en)/:path*"],
};
