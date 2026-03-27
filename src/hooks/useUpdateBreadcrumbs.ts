import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { logger } from "@navikt/next-logger";

import { Breadcrumb, LastCrumb, getBaseCrumbs } from "@utils/breadcrumbs";

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
