import { Bleed, BodyLong, Box, Heading, Link, ReadMore, VStack } from "@navikt/ds-react";
import { getLocale, getTranslations } from "next-intl/server";
import { PropsWithChildren } from "react";

const NavKontorSok = async ({ children }: PropsWithChildren) => {
    const locale = await getLocale();
    const localeSuffix = locale === "nb" ? "" : `/${locale}`;
    return (
        <Link inlineText href={`https://www.nav.no/sok-nav-kontor${localeSuffix}`}>
            {children}
        </Link>
    );
};

const Footer = async () => {
    const t = await getTranslations("Footer");
    const locale = await getLocale();
    const localeSuffix = locale === "nb" ? "" : `/${locale}`;
    return (
        <Bleed marginInline="full" marginBlock="space-64 space-64" asChild reflectivePadding>
            <Box background="accent-soft">
                <VStack gap="space-64" as="aside">
                    <VStack gap="space-8">
                        <Heading size="small" level="2">
                            {t("trengerDuHjelp")}
                        </Heading>
                        <BodyLong>
                            {t.rich("kontaktNavKontor", {
                                tel: (chunks) => (
                                    <Link inlineText href="tel:+4755553333">
                                        {chunks}
                                    </Link>
                                ),
                                lenke: (chunks) => <NavKontorSok>{chunks}</NavKontorSok>,
                            })}
                        </BodyLong>
                    </VStack>
                    <VStack gap="space-8">
                        <Heading size="small" level="2">
                            {t("faq")}
                        </Heading>
                        <ReadMore header={t("ettersende.tittel")}>
                            <VStack gap="space-28">
                                <BodyLong>{t("ettersende.content1")}</BodyLong>
                                <BodyLong>
                                    {t.rich("ettersende.content2", {
                                        lenke: (chunks) => <NavKontorSok>{chunks}</NavKontorSok>,
                                    })}
                                </BodyLong>
                            </VStack>
                        </ReadMore>
                        <ReadMore header={t("melde.tittel")}>
                            <VStack gap="space-28">
                                <BodyLong>
                                    {t.rich("melde.content1", {
                                        lenke: (chunks) => (
                                            <Link
                                                inlineText
                                                href={`https://www.nav.no/okonomisk-sosialhjelp${localeSuffix}#${t("melde.melde")}`}
                                            >
                                                {chunks}
                                            </Link>
                                        ),
                                    })}
                                </BodyLong>
                                <BodyLong>
                                    {t.rich("melde.content2", {
                                        tel: (chunks) => (
                                            <Link inlineText href="tel:+4755553333">
                                                {chunks}
                                            </Link>
                                        ),
                                        lenke: (chunks) => <NavKontorSok>{chunks}</NavKontorSok>,
                                    })}
                                </BodyLong>
                                <BodyLong>
                                    {t.rich("melde.content3", {
                                        tel: (chunks) => (
                                            <Link inlineText href="tel:+4755553333">
                                                {chunks}
                                            </Link>
                                        ),
                                    })}
                                </BodyLong>
                            </VStack>
                        </ReadMore>
                        <ReadMore header={t("svar.tittel")}>
                            <VStack gap="space-28">
                                <BodyLong>{t("svar.content1")}</BodyLong>
                                <BodyLong>{t("svar.content2")}</BodyLong>
                            </VStack>
                        </ReadMore>
                    </VStack>
                    <VStack gap="space-20">
                        <Heading size="small" level="2">
                            {t("relevantInnhold")}
                        </Heading>
                        <VStack gap="space-20" as="ul">
                            <Link
                                as="li"
                                href={`https://www.nav.no/okonomisk-sosialhjelp${localeSuffix}#${t("lenker.klage")}`}
                            >
                                {t("lenker.klagerettigheter")}
                            </Link>
                            <Link as="li" href={`https://www.nav.no/okonomisk-sosialhjelp${localeSuffix}`}>
                                {t("lenker.okonomiskSosialhjelp")}
                            </Link>
                            <Link as="li" href={`https://www.nav.no/ikke-bolig${localeSuffix}`}>
                                {t("lenker.nodsituasjon")}
                            </Link>
                            <Link as="li" href={`https://www.nav.no/okonomi-gjeld${localeSuffix}`}>
                                {t("lenker.radgivning")}
                            </Link>
                            <Link as="li" href={`https://www.nav.no/snakke-med-nav${localeSuffix}`}>
                                {t("lenker.snakke")}
                            </Link>
                            <Link as="li" href={`https://www.nav.no/personopplysninger-sosialhjelp${localeSuffix}`}>
                                {t("lenker.personopplysninger")}
                            </Link>
                        </VStack>
                    </VStack>
                </VStack>
            </Box>
        </Bleed>
    );
};

export default Footer;
