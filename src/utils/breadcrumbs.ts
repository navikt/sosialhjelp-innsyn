import {setBreadcrumbs as setDekoratorBreadcrumbs} from "@navikt/nav-dekoratoren-moduler";

export const parentPage = {
    title: "Økonomisk sosialhjelp",
    url: "/sosialhjelp/innsyn",
};

export const setBreadcrumbs = (page?: {title: string; url: string}) => {
    const crumbs = [parentPage];
    if (page) {
        crumbs.push(page);
    }
    setDekoratorBreadcrumbs(crumbs);
};
