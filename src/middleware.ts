import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { browserEnv } from "./config/env";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Ikke gjør noe med requests til /api eller statiske filer
    if (pathname.startsWith("/_next") || pathname.includes("/api") || PUBLIC_FILE.test(pathname)) {
        return;
    }

    // Sett språk basert på decorator-language cookien
    const decoratorLocale = request.cookies.get("decorator-language")?.value ?? "nb";

    const { NEXT_PUBLIC_BASE_PATH, NEXT_PUBLIC_INNSYN_ORIGIN } = browserEnv;

    if (decoratorLocale !== request.nextUrl.locale) {
        if (request.nextUrl.locale !== "nb") {
            const next = NextResponse.next();
            next.cookies.set("decorator-language", request.nextUrl.locale);
            return next;
        }
        const url = new URL(
            `${NEXT_PUBLIC_INNSYN_ORIGIN}${NEXT_PUBLIC_BASE_PATH}/${
                decoratorLocale === "nb" ? "" : decoratorLocale
            }${pathname.replace("/sosialhjelp/innsyn", "")}`
        );
        return NextResponse.redirect(url);
    }
}
