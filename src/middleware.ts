import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";
import { UNLEASH_COOKIE_NAME } from "./featuretoggles/unleash";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Ikke gjør noe med requests til /api eller statiske filer
    if (pathname.startsWith("/_next") || pathname.includes("/api") || PUBLIC_FILE.test(pathname)) {
        return;
    }

    const i18nMiddleware = createMiddleware(routing);

    const response = i18nMiddleware(request);
    if (request.cookies.get(UNLEASH_COOKIE_NAME)?.value == null) {
        response.cookies.set(UNLEASH_COOKIE_NAME, crypto.randomUUID());
    }
    return response;
}
