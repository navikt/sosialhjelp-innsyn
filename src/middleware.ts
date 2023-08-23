import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {NextURL} from "next/dist/server/web/next-url";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith("/_next") || pathname.includes("/api") || PUBLIC_FILE.test(pathname)) {
        return;
    }
    if (pathname.startsWith("/link")) {
        const searchParams = request.nextUrl.searchParams;
        if (!searchParams.has("goto")) {
            throw new Error("redirect mangler goto-parameter");
        }
        return NextResponse.redirect(new URL(searchParams.get("goto")!, request.nextUrl.origin));
    }

    const decoratorLocale = request.cookies.get("decorator-language")?.value ?? "nb";

    if (decoratorLocale !== request.nextUrl.locale) {
        if (request.nextUrl.locale !== "nb") {
            const next = NextResponse.next();
            next.cookies.set("decorator-language", request.nextUrl.locale);
            return next;
        }
        const url = new URL(
            `${request.nextUrl.origin}${process.env.NEXT_PUBLIC_BASE_PATH}/${
                decoratorLocale === "nb" ? "" : decoratorLocale
            }${pathname.replace("/sosialhjelp/innsyn", "")}`
        );
        return NextResponse.redirect(url);
    }
}
