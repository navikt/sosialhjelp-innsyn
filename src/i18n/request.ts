import { Formats } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

import { DECORATOR_LOCALE_COOKIE_NAME, DEFAULT_LOCALE, isSupportedLocale } from "./common";

export const formats = {
    dateTime: {
        short: {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        },
        long: {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        },
    },
} satisfies Formats;

export default getRequestConfig(async () => {
    const decoratorLocale = (await cookies()).get(DECORATOR_LOCALE_COOKIE_NAME)?.value;
    const locale = decoratorLocale && isSupportedLocale(decoratorLocale) ? decoratorLocale : DEFAULT_LOCALE;

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
        formats: formats,
    };
});
