import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "nb", "nn"],
    defaultLocale: "nb",
    localeCookie: { name: "decorator-language", maxAge: 3600, path: "/" },
});
