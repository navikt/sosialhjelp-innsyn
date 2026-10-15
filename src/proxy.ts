import { NextRequest, NextResponse } from "next/server";
import { isSupportedLocale } from "@i18n/common";
import { UNLEASH_COOKIE_NAME } from "@featuretoggles/unleash";

const PUBLIC_FILE = /\.(.*)$/;

// Matches BCP 47 language tags, e.g. "ru", "zh-TW", "sr-Latn"
const LOCALE_LIKE = /^[a-z]{2,3}(-[A-Za-z0-9]{1,8})*$/;

const addUnleashCookie = (request: NextRequest, response: NextResponse) => {
    if (request.cookies.get(UNLEASH_COOKIE_NAME)?.value == null) {
        response.cookies.set(UNLEASH_COOKIE_NAME, crypto.randomUUID());
    }
    return response;
};

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Ikke gjør noe med requests til /api eller statiske filer
    if (pathname.startsWith("/_next") || pathname.includes("/api") || PUBLIC_FILE.test(pathname)) {
        return;
    }

    const [, urlLocale, ...rest] = pathname.split("/");

    if (urlLocale && isSupportedLocale(urlLocale)) {
        const url = request.nextUrl.clone();
        url.pathname = `/${rest.join("/")}`;
        return NextResponse.redirect(url);
    }

    // If the URL contains an unsupported, but locale-like segment where the locale
    // would normally appear (e.g. /sosialhjelp/innsyn/ru),
    // strip it so next-intl adds the default locale instead of treating it as a path segment.
    // e.g. /sosialhjelp/innsyn/ru  →  redirect to /sosialhjelp/innsyn
    const parts = pathname.split("/");
    const potentialLocale = parts[1];
    if (potentialLocale && LOCALE_LIKE.test(potentialLocale) && !isSupportedLocale(potentialLocale)) {
        return NextResponse.redirect(request.url.replace(`/${potentialLocale}`, ""));
    }

    let response = NextResponse.next();

    if (pathname.includes("/status") && !pathname.includes("/klage")) {
        const id = pathname.split("/")[1];
        // Keeping for backwards compatibility for old status links
        response = NextResponse.rewrite(new URL(`/sosialhjelp/innsyn/soknad/${id}`, request.url), {
            headers: response.headers,
        });
    }

    if (pathname === "/utbetaling") {
        // Keeping for backwards compatibility for old utbetaling links
        response = NextResponse.rewrite(new URL("/sosialhjelp/innsyn/utbetalinger", request.url), {
            headers: response.headers,
        });
    }

    return addUnleashCookie(request, response);
}
