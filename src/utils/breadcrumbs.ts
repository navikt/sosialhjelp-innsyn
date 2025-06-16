import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";

import { routing } from "../i18n/routing";

export type Breadcrumb = { title: string; url: string; analyticsTitle?: string };
export type LastCrumb = { title: string };
export type CompleteCrumb = Parameters<typeof setBreadcrumbs>[0][0];

export const getBaseCrumbs = (t?: (t: string) => string): [CompleteCrumb, CompleteCrumb] => [
    {
        title: t?.("min_side") ?? "Min side",
        url: "https://www.nav.no/minside",
    },
    {
        title: t?.("app.tittel") ?? "Økonomisk sosialhjelp",
        url: "/",
        handleInApp: true,
    },
];

enum PathVariants {
    NotFound = "/404",
    Forbidden = "/403",
    ServerError = "/500",
    Landingsside = "/landingsside",
    Error = "/_error",
    OpprettKlage = "/klage/opprett/",
}

function removeLocales(path: string): string {
    const localeRegex = new RegExp(`/(${routing.locales.join("|")})`, "g");
    return path.replace(localeRegex, "");
}

export const getAppBreadcrumbs = (pathname?: PathVariants | string): Breadcrumb[] => {
    if (!pathname) {
        return [];
    }

    const cleanedPath = removeLocales(pathname);

    //TODO: Make a better way to handle dynamic paths
    if (cleanedPath.startsWith(PathVariants.OpprettKlage)) {
        return [{ title: "Opprett klage", url: "/klage/opprett" }];
    }

    switch (cleanedPath) {
        case PathVariants.Error:
        case PathVariants.ServerError:
            return [];
        case PathVariants.NotFound:
            return [];
        case PathVariants.Forbidden:
            return [];
        case PathVariants.Landingsside:
            return [];
        default:
            throw new Error("Unknown path");
    }
};

// --- Deprecated: delete when Pages folder is fulle migrated ---
enum SsrPathVariants {
    NotFound = "/404",
    Forbidden = "/403",
    ServerError = "/500",
    Root = "/[locale]",
    Utbetaling = "/[locale]/utbetaling",
    Soknad = "/[locale]/[id]/status",
    NyKlage = "/[locale]/[id]/klage/skjema",
    Error = "/_error",
}

export const getBreadcrumbs = (pathname?: SsrPathVariants | string): Breadcrumb[] => {
    switch (pathname) {
        case SsrPathVariants.Root:
            return [...getBaseCrumbs()];
        case SsrPathVariants.Utbetaling:
            return [...getBaseCrumbs(), { title: "Utbetalinger", url: "/utbetaling" }];
        case SsrPathVariants.Soknad:
            return [...getBaseCrumbs(), { title: "Status på søknaden din", url: "/status" }];
        case SsrPathVariants.Error:
        case SsrPathVariants.ServerError:
            return [...getBaseCrumbs(), { title: "Feil: Tekniske problemer", url: "/500" }];
        case SsrPathVariants.NotFound:
            return [...getBaseCrumbs(), { title: "Feil: Fant ikke siden", url: "/404" }];
        case SsrPathVariants.Forbidden:
            return [...getBaseCrumbs(), { title: "Ikke tilgang", url: "/403" }];
        case SsrPathVariants.NyKlage:
            return [
                ...getBaseCrumbs(),
                { title: "Status", url: "/status" },
                { title: "Send klage", url: "/klage/skjema" },
            ];
        default:
            throw new Error("Unknown path");
    }
};
