import {setBreadcrumbs as setDekoratorBreadcrumbs} from "@navikt/nav-dekoratoren-moduler";
import i18next from "i18next";

export const setBreadcrumbs = (page?: {title: string; url: string}) => {
    const crumbs = [
        {
            url: "https://www.nav.no/minside",
            title: i18next.t("min_side"),
        },
        {
            title: i18next.t("app.tittel"),
            url: "/sosialhjelp/innsyn",
        },
    ];
    if (page) {
        crumbs.push(page);
    }
    setDekoratorBreadcrumbs(crumbs);
};
