import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {logger} from "@navikt/next-logger";

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
    if (decoratorLocale !== request.nextUrl.locale) {
        if (request.nextUrl.locale !== "nb") {
            const next = NextResponse.next();
            next.cookies.set("decorator-language", request.nextUrl.locale);
            return next;
        }
        const url = new URL(
            `${process.env.NEXT_PUBLIC_INNSYN_ORIGIN}${process.env.NEXT_PUBLIC_BASE_PATH}/${
                decoratorLocale === "nb" ? "" : decoratorLocale
            }${pathname.replace("/sosialhjelp/innsyn", "")}`
        );
        return NextResponse.redirect(url);
    }

    if (["preprod", "prod"].includes(process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT!)) {
        const sessionUrl = process.env.NEXT_LOGIN_BASE_URL + "/oauth2/session";
        console.log("Sjekker session på ", sessionUrl);
        const fetchResult = await fetch(sessionUrl, {method: "get"});
        console.log(`Fikk status ${fetchResult.status} fra session-endepunkt`);
        const json: {active: boolean} | null = fetchResult.status === 200 ? await fetchResult.json() : null;
        if (fetchResult.status === 401 || json?.active !== true) {
            const redirectUrl =
                process.env.NEXT_LOGIN_BASE_URL +
                "/oauth2/login?redirect=" +
                request.nextUrl.href.replace("0.0.0.0:8080", process.env.NEXT_PUBLIC_INNSYN_ORIGIN!);
            console.log("Bruker er ikke logget inn, sender til login på url ", redirectUrl);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // Router bruker til login hvis vi får 401. Dette gjelder bare for auth gjennom mock-alt. I prod/preprod gjelder dette for "vanlig" innlogging på login.nav.no
    if (["mock", "local"].includes(process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT!)) {
        // Reroute ved kall til /link. Brukes for redirect fra login-api
        if (pathname.startsWith("/link")) {
            const searchParams = request.nextUrl.searchParams;
            if (!searchParams.has("goto")) {
                throw new Error("redirect mangler goto-parameter");
            }
            return NextResponse.redirect(new URL(searchParams.get("goto")!, process.env.NEXT_PUBLIC_INNSYN_ORIGIN));
        }
        try {
            const harTilgangResponse = await fetch(process.env.NEXT_INNSYN_API_BASE_URL + "/api/v1/innsyn/tilgang", {
                headers: new Headers({
                    ...request.headers,
                    Authorization: `Bearer ${request.cookies.get("localhost-idtoken")?.value}`,
                }),
            });
            if (harTilgangResponse.status === 401) {
                const json: AzureAdAuthenticationError = await harTilgangResponse.json();
                const queryDivider = json.loginUrl.includes("?") ? "&" : "?";

                const redirectUrl = getRedirect(
                    json.loginUrl,
                    pathname,
                    process.env.NEXT_PUBLIC_INNSYN_ORIGIN!,
                    json.id
                );
                return NextResponse.redirect(json.loginUrl + queryDivider + redirectUrl);
            }
        } catch (e) {
            logger.warn("Feil i middleware fetch, sender bruker til 500", e);
            return NextResponse.redirect(process.env.NEXT_PUBLIC_INNSYN_ORIGIN + "/sosialhjelp/innsyn/500");
        }
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
