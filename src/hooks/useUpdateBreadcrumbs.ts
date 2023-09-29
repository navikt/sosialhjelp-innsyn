import {setBreadcrumbs} from "@navikt/nav-dekoratoren-moduler";
import {DependencyList, useEffect, useRef} from "react";
import {useTranslation} from "next-i18next";
import {logger} from "@navikt/next-logger";

type Breadcrumb = {title: string; url: string; analyticsTitle?: string};
type LastCrumb = {title: string};
type CompleteCrumb = Parameters<typeof setBreadcrumbs>[0][0];

const getBaseCrumbs = (t?: (t: string) => string): [CompleteCrumb, CompleteCrumb] => [
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

/**
 * The last crumb does not need to provide a URL, since it's only used to display the text for the "active" crumb.
 */
function createCompleteCrumbs(
    breadcrumbs: [...Breadcrumb[], LastCrumb] | [],
    t: (t: string) => string
): CompleteCrumb[] {
    const prefixedCrumbs: CompleteCrumb[] = breadcrumbs.map(
        (crumb): CompleteCrumb => ({
            ...crumb,
            url: "url" in crumb ? `${process.env.NEXT_PUBLIC_BASE_PATH}${crumb.url}` : "/",
            handleInApp: true,
        })
    );

    return [...getBaseCrumbs(t), ...prefixedCrumbs];
}

export function useUpdateBreadcrumbs(makeCrumbs: () => [...Breadcrumb[], LastCrumb] | [], deps?: DependencyList): void {
    const {t} = useTranslation();
    const makeCrumbsRef = useRef(makeCrumbs);
    useEffect(() => {
        makeCrumbsRef.current = makeCrumbs;
    }, [makeCrumbs]);

    useEffect(() => {
        (async () => {
            try {
                const prefixedCrumbs = createCompleteCrumbs(makeCrumbsRef.current(), t);
                await setBreadcrumbs(prefixedCrumbs);
            } catch (e) {
                logger.error(`klarte ikke å oppdatere breadcrumbs på ${location.pathname}`);
                logger.error(e);
            }
        })();
        // Custom hook that passes deps array to useEffect, linting will be done where useUpdateBreadcrumbs is used
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

enum SsrPathVariants {
    NotFound = "/404",
    Forbidden = "/403",
    ServerError = "/500",
    Root = "/",
    Utbetaling = "/utbetaling",
    Soknad = "/[id]/status",
    NyKlage = "/[id]/klage/skjema",
    Error = "/_error",
}

export const getBreadcrumbs = (pathname: SsrPathVariants | string): Breadcrumb[] => {
    switch (pathname) {
        case SsrPathVariants.Root:
            return [...getBaseCrumbs()];
        case SsrPathVariants.Utbetaling:
            return [...getBaseCrumbs(), {title: "Utbetalinger", url: "/utbetaling"}];
        case SsrPathVariants.Soknad:
            return [...getBaseCrumbs(), {title: "Status på søknaden din", url: "/status"}];
        case SsrPathVariants.Error:
        case SsrPathVariants.ServerError:
            return [...getBaseCrumbs(), {title: "Feil: Tekniske problemer", url: "/500"}];
        case SsrPathVariants.NotFound:
            return [...getBaseCrumbs(), {title: "Feil: Fant ikke siden", url: "/404"}];
        case SsrPathVariants.Forbidden:
            return [...getBaseCrumbs(), {title: "Ikke tilgang", url: "/403"}];
        case SsrPathVariants.NyKlage:
            return [...getBaseCrumbs(), {title: "Status", url: "/status"}, {title: "Send klage", url: "/klage/skjema"}];
        default:
            throw new Error("Unknown path");
    }
};

export default useUpdateBreadcrumbs;
