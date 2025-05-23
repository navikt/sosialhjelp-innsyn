export const DECORATOR_LOCALE_COOKIE_NAME = "decorator-language";
export const SUPPORTED_LOCALES = ["en", "nb", "nn"] as const;
export const DEFAULT_LOCALE = "nb" as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const isSupportedLocale = (lang: string): lang is SupportedLocale =>
    SUPPORTED_LOCALES.includes(lang as SupportedLocale);
