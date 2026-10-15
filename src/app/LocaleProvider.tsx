"use client";

import { NextIntlClientProvider } from "next-intl";
import { PropsWithChildren, useEffect, useState } from "react";
import { onLanguageSelect, setParams } from "@navikt/nav-dekoratoren-moduler";
import { useRouter } from "next/navigation";
import { isSupportedLocale, SupportedLocale } from "@i18n/common";

interface Props {
    locale: SupportedLocale;
    messages: Record<string, unknown>;
}

const LocaleProvider = ({ locale: initialLocale, messages: initialMessages, children }: PropsWithChildren<Props>) => {
    const router = useRouter();
    const [locale, setLocale] = useState(initialLocale);
    const [messages, setMessages] = useState(initialMessages);

    useEffect(() => {
        onLanguageSelect(({ locale }) => {
            if (!isSupportedLocale(locale)) {
                return;
            }

            void import(`../../messages/${locale}.json`).then((messages) => {
                setLocale(locale);
                setMessages(messages.default);
                document.documentElement.lang = locale;
                void setParams({ language: locale });
                router.refresh();
            });
        });
    }, [router]);

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
};

export default LocaleProvider;
