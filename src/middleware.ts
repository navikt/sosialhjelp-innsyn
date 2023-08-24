import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

interface AzureAdAuthenticationError {
    id: string;
    message: string;
    loginUrl: string;
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Ikke gjør noe med requests til /api eller statiske filer
    if (pathname.startsWith("/_next") || pathname.includes("/api") || PUBLIC_FILE.test(pathname)) {
        return;
    }

    // Reroute ved kall til /link. Brukes for redirect fra login-api
    if (pathname.startsWith("/link")) {
        const searchParams = request.nextUrl.searchParams;
        if (!searchParams.has("goto")) {
            throw new Error("redirect mangler goto-parameter");
        }
        return NextResponse.redirect(new URL(searchParams.get("goto")!, request.nextUrl.origin));
    }

    // Sett språk basert på decorator-language cookien
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

    // Router bruker til login hvis vi får 401
    const harTilgangResponse = await fetch(process.env.NEXT_PUBLIC_INNSYN_API_BASE_URL + "/api/v1/innsyn/tilgang", {
        headers: new Headers(request.headers),
    });

    if (harTilgangResponse.status === 401) {
        const json: AzureAdAuthenticationError = await harTilgangResponse.json();
        const queryDivider = json.loginUrl.includes("?") ? "&" : "?";
        return NextResponse.redirect(
            json.loginUrl + queryDivider + getRedirect(json.loginUrl, pathname, request.nextUrl.origin, json.id)
        );
    }
}

const getRedirect = (loginUrl: string, pathname: string, origin: string, id: string) => {
    const _pathname = pathname.includes("/sosialhjelp/innsyn") ? pathname : "/sosialhjelp/innsyn" + pathname;
    if (loginUrl.indexOf("digisos.intern.dev.nav.no") === -1) {
        const gotoParameter = "goto=" + _pathname;
        const redirectPath = origin + "/sosialhjelp/innsyn/link?" + gotoParameter;
        return "redirect=" + redirectPath + "%26login_id=" + id;
    } else {
        // ikke loginservice --> direkte-integrasjon med idporten i innsyn-api:
        return "goto=" + origin + _pathname;
    }
};
