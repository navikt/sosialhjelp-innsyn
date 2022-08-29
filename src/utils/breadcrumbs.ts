import {setBreadcrumbs as setDekoratorBreadcrumbs} from "@navikt/nav-dekoratoren-moduler";

const sosialhjelpPage = {
    title: "Økonomisk sosialhjelp",
    url: "/sosialhjelp/innsyn",
};

const dittNavPage = {
    url: "https://www.nav.no/minside",
    title: "Min side",
};

export const setBreadcrumbs = (page?: {title: string; url: string}) => {
    const crumbs = [dittNavPage, sosialhjelpPage];
    if (page) {
        crumbs.push(page);
    }
    setDekoratorBreadcrumbs(crumbs);
};
