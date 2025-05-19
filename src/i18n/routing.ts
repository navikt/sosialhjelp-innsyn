import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "nb", "nn"],
    defaultLocale: "nb",
    pathnames: {
        "/": "/",
        "/pathnames": {
            nb: "/pfadnamen",
        },
    },
});
