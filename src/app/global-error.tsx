"use client";

import "./globals.css";
import Cookie from "js-cookie";
import { configureLogger, logger } from "@navikt/next-logger";
import { injectDecoratorClientSide, onBreadcrumbClick, onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import React, { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { pick } from "remeda";
import { Loader, Theme } from "@navikt/ds-react";
import { Page, PageBlock } from "@navikt/ds-react/Page";
import { usePathname, useRouter } from "next/navigation";

import decoratorParams from "@config/decoratorConfig";
import { DECORATOR_LOCALE_COOKIE_NAME, isSupportedLocale } from "@i18n/common";
import ErrorPage from "@components/error/ErrorPage";
import { getFaro, initInstrumentation, pinoLevelToFaroLevel } from "@faro/faro";

import Preload from "./preload";

initInstrumentation();
configureLogger({
    basePath: "/sosialhjelp/innsyn",
    onLog: (log) =>
        getFaro()?.api.pushLog(log.messages, {
            level: pinoLevelToFaroLevel(log.level.label),
        }),
});

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
    const langCookie = Cookie.get(DECORATOR_LOCALE_COOKIE_NAME);
    const locale = langCookie && isSupportedLocale(langCookie) ? langCookie : "nb";

    logger.error(`Uncaught clientside error: ${error.name}, global-error.tsx shown. Error: ${error}`);
    const [messages, setMessages] = useState<Record<string, unknown> | null>();

    useEffect(() => {
        import(`../../messages/${locale}.json`)
            .then((messages) => {
                setMessages(pick(messages, ["ErrorPage", "TrengerDuRaskHjelp"]));
            })
            .catch((e) => {
                logger.error(`Klarte ikke å hente messages i global-error.tsx. ${e}`);
            });
    }, [locale]);

    useEffect(() => {
        if (messages) {
            injectDecoratorClientSide(decoratorParams(locale));
        }
    }, [messages, locale]);

    const router = useRouter();
    const pathname = usePathname();

    onLanguageSelect(async () => {
        router.replace(pathname.replace(/\/(en|nn|nb)/, "/"));
        window.location.reload();
    });

    onBreadcrumbClick((breadcrumb) => router.push(breadcrumb.url));

    if (!messages) {
        return <Loader />;
    }

    const htmlTitle = (messages["ErrorPage"] as Record<string, string>)["htmlTitle"];
    return (
        <html lang={locale}>
            <head>
                <title>{htmlTitle}</title>
                <link rel="icon" href="https://www.nav.no/favicon.ico" type="image/x-icon" />
            </head>
            <Preload />
            <body>
                <Page>
                    <Theme theme="light">
                        <PageBlock as="main" width="md" gutters className="mb-16">
                            {!messages && <Loader size="3xlarge" />}
                            {messages && (
                                <NextIntlClientProvider locale={locale} messages={messages}>
                                    <ErrorPage />
                                </NextIntlClientProvider>
                            )}
                        </PageBlock>
                    </Theme>
                </Page>
            </body>
        </html>
    );
}
