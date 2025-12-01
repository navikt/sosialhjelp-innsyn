import "./globals.css";

import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Script from "next/script";
import { cookies } from "next/headers";
import { Page, PageBlock } from "@navikt/ds-react/Page";
import { PropsWithChildren } from "react";
import { Theme } from "@navikt/ds-react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { pick } from "remeda";

import { DECORATOR_LOCALE_COOKIE_NAME, isSupportedLocale } from "@i18n/common";
import decoratorParams from "@config/decoratorConfig";

import Preload from "./preload";

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: PropsWithChildren) {
    const jar = await cookies();
    const cookie = jar.get(DECORATOR_LOCALE_COOKIE_NAME)?.value;
    const locale = cookie && isSupportedLocale(cookie) ? cookie : "nb";

    const props = decoratorParams(locale);
    const Decorator = await fetchDecoratorReact(props);
    const messages = await getMessages({ locale });

    return (
        <html lang={locale || "nb"}>
            <head>
                <Decorator.HeadAssets />
                <link rel="icon" href="https://www.nav.no/favicon.ico" type="image/x-icon" />
            </head>
            <Preload />
            <body>
                <NextIntlClientProvider locale={locale} messages={pick(messages, ["ErrorPage", "TrengerDuRaskHjelp"])}>
                    <Theme theme="light">
                        <Page footer={<Decorator.Footer />}>
                            <Decorator.Header />
                            <PageBlock as="main" width="md" gutters>
                                {children}
                            </PageBlock>
                        </Page>
                    </Theme>
                </NextIntlClientProvider>
                <Decorator.Scripts loader={Script} />
            </body>
        </html>
    );
}
