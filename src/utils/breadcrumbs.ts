import {setBreadcrumbs as setDekoratorBreadcrumbs} from "@navikt/nav-dekoratoren-moduler";

const sosialhjelpPage = {
    title: "Økonomisk sosialhjelp",
    url: "/sosialhjelp",
};

const innsynPage = {
    title: "Innsyn",
    url: "/sosialhjelp/innsyn",
};

export const setBreadcrumbs = (page?: {title: string; url: string}) => {
    const crumbs = [sosialhjelpPage, innsynPage];
    if (page) {
        crumbs.push(page);
    }
    setDekoratorBreadcrumbs(crumbs);
};
