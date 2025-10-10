import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@i18n/routing";
import { getFlag, getToggles, UNLEASH_COOKIE_NAME } from "@featuretoggles/unleash";

const PUBLIC_FILE = /\.(.*)$/;

const rewrite = async (request: NextRequest) => {
    const toggles = await getToggles();
    const landingssideToggle = getFlag("sosialhjelp.innsyn.ny_landingsside", toggles);
    // Eksempel: /nb -> ['', 'nb'], segments = []
    const [, , ...segments] = request.nextUrl.pathname.split("/");

    // Rewrite til landingsside hvis landingssideToggle er på og bruker besøker index
    if (landingssideToggle.enabled && segments.length === 0) {
        return NextResponse.rewrite(request.nextUrl.href + "/landingsside");
    }

    const utbetalingsideToggle = getFlag("sosialhjelp.innsyn.ny_utbetalinger_side", toggles);
    if (segments[0] === "utbetaling" && utbetalingsideToggle.enabled) {
        return NextResponse.rewrite(request.nextUrl.href.replace("/utbetaling", "/utbetalinger"));
    }
};

const addUnleashCookie = (request: NextRequest, response: NextResponse) => {
    if (request.cookies.get(UNLEASH_COOKIE_NAME)?.value == null) {
        response.cookies.set(UNLEASH_COOKIE_NAME, crypto.randomUUID());
    }
    return response;
};

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Ikke gjør noe med requests til /api eller statiske filer
    if (pathname.startsWith("/_next") || pathname.includes("/api") || PUBLIC_FILE.test(pathname)) {
        return;
    }

    const i18nMiddleware = createMiddleware(routing);

    let response: NextResponse = i18nMiddleware(request);
    // Hvis bruker må redirectes for språket, så blir det satt som en 3XX, dvs. !ok.
    if (response.ok) {
        response = (await rewrite(request)) ?? response;
    }
    return addUnleashCookie(request, response);
}
