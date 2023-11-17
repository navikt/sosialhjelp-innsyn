import {randomUUID} from "node:crypto";

export function isProd() {
    return process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "prod";
}

export function isLocalhost() {
    return process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local";
}

export function isDevSbs(): boolean {
    return process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "dev-sbs";
}

export function isDev(): boolean {
    return process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "dev";
}

export function isMock(): boolean {
    return process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "mock";
}

export function isUsingMockAlt(): boolean {
    return isMock();
}

export function generateCallId(): string {
    let randomNr = crypto.randomUUID();
    let systemTime = Date.now();

    return `CallId_${systemTime}_${randomNr}`;
}

export enum HttpErrorType {
    UNAUTHORIZED = "unauthorized",
    UNAUTHORIZED_LOOP = "unauthorized_loop",
    FORBIDDEN = "Forbidden",
    SERVICE_UNAVAILABLE = "Service Unavailable",
    NOT_FOUND = "Not found",
}

function getRedirectOrigin() {
    /* Vi endrer preprod-url til www-q*.dev.nav.no (pga naisdevice).
     * Men den gamle URL-en (www-q*.nav.no) vil bli benyttet en stund av kommuner.
     * Loginservice kan kun sette cookies på apper som kjører på samme domene.
     * Vi lar derfor loginservice redirecte til den nye ingressen. */
    return window.location.origin;
}

export function getRedirectPath(loginUrl: string, id: string): string {
    const redirectOrigin = getRedirectOrigin();
    if (loginUrl.indexOf("digisos.intern.dev.nav.no") === -1) {
        const gotoParameter = "goto=" + window.location.pathname;
        const redirectPath = redirectOrigin + "/sosialhjelp/innsyn/link?" + gotoParameter;
        return "redirect=" + redirectPath + "%26login_id=" + id;
    } else {
        // ikke loginservice --> direkte-integrasjon med idporten i innsyn-api:
        return "goto=" + redirectOrigin + window.location.pathname;
    }
}
