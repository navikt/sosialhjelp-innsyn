import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logger } from "@navikt/next-logger";

import { browserEnv, getServerEnv } from "./config/env";

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

    // Sett språk basert på decorator-language cookien
    const decoratorLocale = request.cookies.get("decorator-language")?.value ?? "nb";

    const { NEXT_PUBLIC_BASE_PATH, NEXT_PUBLIC_INNSYN_ORIGIN, NEXT_PUBLIC_RUNTIME_ENVIRONMENT } = browserEnv;
    const { NEXT_INNSYN_API_BASE_URL } = getServerEnv();

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

    // Router bruker til login hvis vi får 401. Dette gjelder bare for auth gjennom mock-alt. I prod/preprod gjelder dette for "vanlig" innlogging på login.nav.no
    if (["mock", "local"].includes(NEXT_PUBLIC_RUNTIME_ENVIRONMENT)) {
        // Reroute ved kall til /link. Brukes for redirect fra login-api
        if (pathname.startsWith("/link")) {
            const gotoParam = request.nextUrl.searchParams.get("goto");
            if (!gotoParam) throw new Error("redirect mangler goto-parameter");
            return NextResponse.redirect(new URL(gotoParam, NEXT_PUBLIC_INNSYN_ORIGIN));
        }

        try {
            const headers = new Headers(request.headers);
            headers.append("Authorization", `Bearer ${request.cookies.get("localhost-idtoken")?.value}`);
            const harTilgangResponse = await fetch(`${NEXT_INNSYN_API_BASE_URL}/api/v1/innsyn/tilgang`, {
                headers,
                credentials: "include",
            });
            if (harTilgangResponse.status === 401) {
                const json: AzureAdAuthenticationError = await harTilgangResponse.json();
                const queryDivider = json.loginUrl.includes("?") ? "&" : "?";

                const redirectUrl = getRedirect(json.loginUrl, pathname, NEXT_PUBLIC_INNSYN_ORIGIN, json.id);
                return NextResponse.redirect(json.loginUrl + queryDivider + redirectUrl);
            }
        } catch (e) {
            // ikke logg eller redirect dersom feilen oppstod i forsøk på å rendre 500-siden
            if (pathname === "/500") return;
            logger.warn("Feil i middleware fetch, sender bruker til 500", e);
            return NextResponse.redirect(`${NEXT_PUBLIC_INNSYN_ORIGIN}/sosialhjelp/innsyn/500`);
        }
    }
}

const getRedirect = (loginUrl: string, pathname: string, origin: string, id: string) => {
    const _pathname = pathname.includes("/sosialhjelp/innsyn") ? pathname : `/sosialhjelp/innsyn${pathname}`;
    if (loginUrl.indexOf("digisos.intern.dev.nav.no") === -1) {
        return `redirect=${origin}/sosialhjelp/innsyn/link?goto=${_pathname}%26login_id=${id}`;
    } else {
        // ikke loginservice --> direkte-integrasjon med idporten i innsyn-api:
        return "goto=" + origin + _pathname;
    }
};
