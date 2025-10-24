import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@i18n/routing";
import { getFlag, getToggles, UNLEASH_COOKIE_NAME } from "@featuretoggles/unleash";

const PUBLIC_FILE = /\.(.*)$/;

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

    const toggles = await getToggles();

    // Check if we need to rewrite before i18n processes the request
    const utbetalingsideToggle = getFlag("sosialhjelp.innsyn.ny_utbetalinger_side", toggles);
    const landingssideToggle = getFlag("sosialhjelp.innsyn.ny_landingsside", toggles);

    // Determine if this is a path that needs rewriting
    // Match /nb/utbetaling but not /nb/utbetalinger
    const needsUtbetalingRewrite = utbetalingsideToggle.enabled && /\/utbetaling(\/|$|\?)/.test(pathname);
    const needsLandingssideRewrite = landingssideToggle.enabled && pathname.match(/^\/[^\/]+\/?$/);

    // If we need to rewrite, modify the request URL before i18n processes it
    let modifiedRequest = request;
    if (needsUtbetalingRewrite || needsLandingssideRewrite) {
        const newUrl = new URL(request.url);

        if (needsUtbetalingRewrite) {
            // Replace /utbetaling with /utbetalinger (but not if it's already /utbetalinger)
            newUrl.pathname = pathname.replace(/\/utbetaling(\/|$|\?)/, "/utbetalinger$1");
        } else if (needsLandingssideRewrite) {
            newUrl.pathname = pathname.replace(/^(\/[^\/]+)\/?$/, "$1/landingsside");
        }

        modifiedRequest = new NextRequest(newUrl, request);
    }

    const i18nMiddleware = createMiddleware(routing);
    let response: NextResponse = i18nMiddleware(modifiedRequest);

    // If i18n middleware added a locale query parameter, remove it
    if (!response.ok && response.status >= 300 && response.status < 400) {
        // This is a redirect - check the Location header
        const location = response.headers.get("location");
        if (location && location.includes("?locale=")) {
            const url = new URL(location, request.url);
            url.searchParams.delete("locale");
            response = NextResponse.redirect(url);
        }
    }

    return addUnleashCookie(request, response);
}
