import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@i18n/routing";
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

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Ikke gjør noe med requests til /api eller statiske filer
    if (pathname.startsWith("/_next") || pathname.includes("/api") || PUBLIC_FILE.test(pathname)) {
        return;
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

    let response = handleI18nRouting(request);

    // I testmiljøene mangler F5 BIG-IP-laget som prod har. BIG-IP normaliserer
    // x-forwarded-port til 443, slik at Next.js vet at ekstern URL ikke har
    // eksplisitt port. Uten dette inkluderer Next.js intern containerport (8080)
    // i nextUrl, og next-intl arver den i Location-headeren på locale-redirects.
    //
    // Løsning: hvis vi er bak en HTTPS-proxy (x-forwarded-proto: https) og
    // Location-headeren inneholder en ikke-standard port, fjerner vi den.
    // Ekstern HTTPS bruker alltid port 443 (implisitt), så dette er alltid riktig.
    const location = response.headers.get("location");
    if (location && request.headers.get("x-forwarded-proto") === "https") {
        try {
            const locationUrl = new URL(location);
            if (locationUrl.port !== "" && locationUrl.port !== "443") {
                locationUrl.port = "";
                response = NextResponse.redirect(locationUrl.toString(), response.status);
            }
        } catch {
            // Relativ URL — ingen port å fjerne
        }
    }

    if (response.ok) {
        const [, , , locale, ...rest] = new URL(
            response.headers.get("x-middleware-rewrite") || request.url
        ).pathname.split("/");
        const pathname = "/" + rest.join("/");

        if (pathname.includes("/status") && !pathname.includes("/klage")) {
            const id = pathname.split("/")[1];
            // Keeping for backwards compatibility for old status links
            response = NextResponse.rewrite(new URL(`/sosialhjelp/innsyn/${locale}/soknad/${id}`, request.url), {
                headers: response.headers,
            });
        }

        if (pathname === "/utbetaling") {
            // Keeping for backwards compatibility for old utbetaling links
            response = NextResponse.rewrite(new URL(`/sosialhjelp/innsyn/${locale}/utbetalinger`, request.url), {
                headers: response.headers,
            });
        }
    }

    return addUnleashCookie(request, response);
}
