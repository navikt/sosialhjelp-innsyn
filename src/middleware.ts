import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logger } from "@navikt/next-logger";
import createMiddleware from "next-intl/middleware";

import { browserEnv, getServerEnv } from "./config/env";
import { routing } from "./i18n/routing";
import { UNLEASH_COOKIE_NAME } from "./featuretoggles/unleash";

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

    const { NEXT_PUBLIC_INNSYN_ORIGIN, NEXT_PUBLIC_RUNTIME_ENVIRONMENT } = browserEnv;
    const { NEXT_INNSYN_API_BASE_URL } = getServerEnv();
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

    const i18nMiddleware = createMiddleware(routing);

    const response = i18nMiddleware(request);
    if (request.cookies.get(UNLEASH_COOKIE_NAME)?.value == null) {
        response.cookies.set(UNLEASH_COOKIE_NAME, crypto.randomUUID());
    }
    return response;
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
