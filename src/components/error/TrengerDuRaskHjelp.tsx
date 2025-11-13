import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bleed, BodyShort, Box, Heading, Link, List, VStack } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";

import { SupportedLocale } from "@i18n/common";

const TrengerDuRaskHjelp = (): React.JSX.Element => {
    const t = useTranslations("TrengerDuRaskHjelp");
    const locale = useLocale() as SupportedLocale;
    return (
        <Bleed marginInline="full" className="pt-12 pb-12" marginBlock="space-0 space-64" asChild>
            <Box.New background="neutral-soft" padding="space-12" className="flex-1">
                <Box.New className="max-w-3xl lg:max-w-2xl mx-auto">
                    <VStack gap="6">
                        <Heading level="2" size="medium">
                            {t("tittel")}
                        </Heading>
                        <BodyShort>
                            {t.rich("sokePapir", {
                                link: (chunks) => (
                                    <Link href={`https://www.nav.no/start/okonomisk-sosialhjelp/${locale}`}>
                                        {chunks}
                                    </Link>
                                ),
                            })}
                        </BodyShort>
                        <Heading level="3" size="small">
                            {t("finnKontor")}
                        </Heading>
                        <List>
                            <ListItem>
                                <Link href="https://www.nav.no/person/personopplysninger/#ditt-nav-kontor">
                                    {t("finnDittNavkontor")}
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link href="https://www.nav.no/sok-nav-kontor">{t("sokOppDittNavKontor")}</Link>
                            </ListItem>
                        </List>
                        <BodyShort>{t("nodhjelp")}</BodyShort>
                        <BodyShort>{t("botilbud")}</BodyShort>

                        <BodyShort>
                            <Link href="/sosialhjelp/innsyn">{t("forsideSosialhjelp")}</Link>
                        </BodyShort>

                        <BodyShort>
                            <Link href="https://www.nav.no">{t("forsideNav")}</Link>
                        </BodyShort>

                        <BodyShort>
                            <Link href="https://www.nav.no/minside">{t("mineSider")}</Link>
                        </BodyShort>

                        <BodyShort>
                            <Link href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
                                {t("feilRapport")}
                            </Link>
                        </BodyShort>
                    </VStack>
                </Box.New>
            </Box.New>
        </Bleed>
    );
};

export default TrengerDuRaskHjelp;
