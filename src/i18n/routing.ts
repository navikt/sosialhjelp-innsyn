import { defineRouting } from "next-intl/routing";

import { SUPPORTED_LOCALES, DEFAULT_LOCALE, DECORATOR_LOCALE_COOKIE_NAME } from "./common";

export const routing = defineRouting({
    locales: SUPPORTED_LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    localeCookie: { name: DECORATOR_LOCALE_COOKIE_NAME, maxAge: 3600, path: "/" },
});
