import { BodyLong, Heading, Link, List, ReadMore, VStack } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { useLocale, useTranslations } from "next-intl";

const DokKravReadMore = () => {
    const t = useTranslations("DokKravReadMore");
    const locale = useLocale();
    const localeSuffix = locale === "nb" ? "" : `/${locale}`;
    return (
        <ReadMore header={t("header")}>
            <VStack gap="space-32">
                <VStack>
                    <Heading level="3" size="xsmall">
                        {t("papirHeading")}
                    </Heading>
                    <VStack gap="space-8">
                        <BodyLong>{t("papirIntro")}</BodyLong>
                        <List as="ul" size="small">
                            <ListItem>
                                <BodyLong>{t("papirStep1")}</BodyLong>
                            </ListItem>
                            <ListItem>
                                <BodyLong>{t("papirStep2")}</BodyLong>
                            </ListItem>
                            <ListItem>
                                <BodyLong>{t("papirStep3")}</BodyLong>
                            </ListItem>
                            <ListItem>
                                <BodyLong>{t("papirStep4")}</BodyLong>
                            </ListItem>
                        </List>
                        <BodyLong>{t("papirSkanner")}</BodyLong>
                    </VStack>
                </VStack>
                <VStack>
                    <Heading level="3" size="xsmall">
                        {t("nettsiderHeading")}
                    </Heading>
                    <BodyLong spacing>{t("nettsiderBody1")}</BodyLong>
                    <BodyLong>{t("nettsiderBody2")}</BodyLong>
                </VStack>
                <VStack>
                    <Heading level="3" size="xsmall">
                        {t("problemerHeading")}
                    </Heading>
                    <BodyLong spacing>{t("problemerBody1")}</BodyLong>
                    <BodyLong>
                        {t.rich("problemerBody2", {
                            ring: (chunks) => (
                                <Link href="tel:+4755553333" inlineText>
                                    {chunks}
                                </Link>
                            ),
                            kontor: (chunks) => (
                                <Link href={`https://www.nav.no/sok-nav-kontor${localeSuffix}`} inlineText>
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </BodyLong>
                </VStack>
            </VStack>
        </ReadMore>
    );
};

export default DokKravReadMore;
