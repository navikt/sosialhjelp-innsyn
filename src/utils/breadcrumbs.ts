import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";

export type Breadcrumb = { title: string; url: string; analyticsTitle?: string };
export type LastCrumb = { title: string };
export type CompleteCrumb = Parameters<typeof setBreadcrumbs>[0][0];

export const getBaseCrumbs = (t?: (t: string) => string): [CompleteCrumb, CompleteCrumb] => [
    {
        title: t?.("MinSide") ?? "Min side",
        url: "https://www.nav.no/minside",
    },
    {
        title: t?.("Sosialhjelp") ?? "Økonomisk sosialhjelp",
        url: "/sosialhjelp/innsyn",
    },
];
