import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { DependencyList, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { logger } from "@navikt/next-logger";

import { Breadcrumb, LastCrumb, CompleteCrumb, getBaseCrumbs } from "../utils/breadcrumbs";

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
    const t = useTranslations("Breadcrumbs");
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

export const useSetBreadcrumbs = (dynamicBreadcrumbs: (Breadcrumb | LastCrumb)[] = []) => {
    const t = useTranslations("Breadcrumbs");

    useEffect(() => {
        const crumbs = [...getBaseCrumbs(t), ...dynamicBreadcrumbs];
        (async () => {
            try {
                await setBreadcrumbs(
                    crumbs.map((it) => ({
                        ...it,
                        url: "url" in it ? `${it.url}` : "/",
                    }))
                );
            } catch (e) {
                logger.error(`klarte ikke å oppdatere breadcrumbs på ${location.pathname}`);
                logger.error(e);
            }
        })();
    }, [dynamicBreadcrumbs, t]);
};

export default useUpdateBreadcrumbs;
