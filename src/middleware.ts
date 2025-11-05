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

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Ikke gjør noe med requests til /api eller statiske filer
    if (pathname.startsWith("/_next") || pathname.includes("/api") || PUBLIC_FILE.test(pathname)) {
        return;
    }
    let response = handleI18nRouting(request);

    if (response.ok) {
        const toggles = await getToggles();

        const utbetalingsideToggle = getFlag("sosialhjelp.innsyn.ny_utbetalinger_side", toggles);
        const landingssideToggle = getFlag("sosialhjelp.innsyn.ny_landingsside", toggles);

        const [, , , locale, ...rest] = new URL(
            response.headers.get("x-middleware-rewrite") || request.url
        ).pathname.split("/");
        const pathname = "/" + rest.join("/");

        if (pathname === "/" && landingssideToggle.enabled) {
            response = NextResponse.rewrite(new URL(`/sosialhjelp/innsyn/${locale}/landingsside`, request.url), {
                headers: response.headers,
            });
        } else if (pathname === "/utbetaling" && utbetalingsideToggle.enabled) {
            response = NextResponse.rewrite(new URL(`/sosialhjelp/innsyn/${locale}/utbetalinger`, request.url), {
                headers: response.headers,
            });
        }
    }

    return addUnleashCookie(request, response);
}

export const config = {
    runtime: "nodejs",
};
