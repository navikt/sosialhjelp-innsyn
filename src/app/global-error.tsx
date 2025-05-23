"use client";

import Cookie from "js-cookie";

import { DECORATOR_LOCALE_COOKIE_NAME, isSupportedLocale } from "../i18n/common";
import ServerError from "../pages/500";

export default function GlobalError() {
    const langCookie = Cookie.get(DECORATOR_LOCALE_COOKIE_NAME);
    const locale = langCookie && isSupportedLocale(langCookie) ? langCookie : "nb";

    return (
        <html lang={locale}>
            <head>
                <title>Teknisk feil | Økonomisk sosialhjelp</title>
            </head>
            <body>
                <div id="root" role="none">
                    <div className="min-h-[50vh]">
                        <ServerError />
                    </div>
                </div>
            </body>
        </html>
    );
}
