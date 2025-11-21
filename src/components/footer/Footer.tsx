import { Bleed, BodyShort, BoxNew, Heading, Link, ReadMore, VStack } from "@navikt/ds-react";
import { getLocale, getTranslations } from "next-intl/server";
import { PropsWithChildren } from "react";

const NavKontorSok = async ({ children }: PropsWithChildren) => {
    const locale = await getLocale();
    const localeSuffix = locale === "nb" ? "" : `/${locale}`;
    return <Link href={`https://www.nav.no/sok-nav-kontor${localeSuffix}`}>{children}</Link>;
};

const Footer = async () => {
    const t = await getTranslations("Footer");
    const locale = await getLocale();
    const localeSuffix = locale === "nb" ? "" : `/${locale}`;
    return (
        <Bleed marginInline="full" marginBlock="0 space-64" asChild reflectivePadding>
            <BoxNew background="accent-soft" className="flex flex-col gap-16 py-20">
                <VStack gap="2">
                    <Heading size="medium" level="2">
                        {t("trengerDuHjelp")}
                    </Heading>
                    <BodyShort>
                        {t.rich("kontaktNavKontor", {
                            tel: (chunks) => <Link href="tel:+4755553333">{chunks}</Link>,
                            lenke: (chunks) => <NavKontorSok>{chunks}</NavKontorSok>,
                        })}
                    </BodyShort>
                </VStack>
                <VStack gap="2">
                    <Heading size="small" level="2">
                        {t("faq")}
                    </Heading>
                    <ReadMore header={t("ettersende.tittel")}>
                        <VStack gap="7">
                            <BodyShort>{t("ettersende.content1")}</BodyShort>
                            <BodyShort>
                                {t.rich("ettersende.content2", {
                                    lenke: (chunks) => <NavKontorSok>{chunks}</NavKontorSok>,
                                })}
                            </BodyShort>
                        </VStack>
                    </ReadMore>
                    <ReadMore header={t("melde.tittel")}>
                        <VStack gap="7">
                            <BodyShort>
                                {t.rich("melde.content1", {
                                    lenke: (chunks) => (
                                        <Link
                                            href={`https://www.nav.no/okonomisk-sosialhjelp${localeSuffix}#${t("melde.melde")}`}
                                        >
                                            {chunks}
                                        </Link>
                                    ),
                                })}
                            </BodyShort>
                            <BodyShort>
                                {t.rich("melde.content2", {
                                    tel: (chunks) => <Link href="tel:+4755553333">{chunks}</Link>,
                                    lenke: (chunks) => <NavKontorSok>{chunks}</NavKontorSok>,
                                })}
                            </BodyShort>
                            <BodyShort>
                                {t.rich("melde.content3", {
                                    tel: (chunks) => <Link href="tel:+4755553333">{chunks}</Link>,
                                })}
                            </BodyShort>
                        </VStack>
                    </ReadMore>
                    <ReadMore header={t("svar.tittel")}>
                        <VStack gap="7">
                            <BodyShort>{t("svar.content1")}</BodyShort>
                            <BodyShort>{t("svar.content2")}</BodyShort>
                        </VStack>
                    </ReadMore>
                </VStack>
                <VStack gap="2">
                    <Heading size="small" level="2">
                        {t("relevantInnhold")}
                    </Heading>
                    <VStack gap="2" as="ul">
                        <li>
                            <Link href={`https://www.nav.no/okonomisk-sosialhjelp${localeSuffix}#${t("lenker.klage")}`}>
                                {t("lenker.klagerettigheter")}
                            </Link>
                        </li>
                        <li>
                            <Link href={`https://www.nav.no/okonomisk-sosialhjelp${localeSuffix}`}>
                                {t("lenker.okonomiskSosialhjelp")}
                            </Link>
                        </li>
                        <li>
                            <Link href={`https://www.nav.no/ikke-bolig${localeSuffix}`}>
                                {t("lenker.nodsituasjon")}
                            </Link>
                        </li>
                        <li>
                            <Link href={`https://www.nav.no/okonomi-gjeld${localeSuffix}`}>
                                {t("lenker.radgivning")}
                            </Link>
                        </li>
                        <li>
                            <Link href={`https://www.nav.no/snakke-med-nav${localeSuffix}`}>{t("lenker.snakke")}</Link>
                        </li>
                        <li>
                            <Link href={`https://www.nav.no/personopplysninger-sosialhjelp${localeSuffix}`}>
                                {t("lenker.personopplysninger")}
                            </Link>
                        </li>
                    </VStack>
                </VStack>
            </BoxNew>
        </Bleed>
    );
};

export default Footer;
