import { BodyLong, Heading, Link, List, ReadMore } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { useLocale, useTranslations } from "next-intl";

const DokKravReadMore = () => {
    const t = useTranslations("DokKravReadMore");
    const locale = useLocale();
    const localeSuffix = locale === "nb" ? "" : `/${locale}`;
    return (
        <ReadMore header={t("header")}>
            <Heading level="3" size="xsmall">
                {t("papirHeading")}
            </Heading>
            <BodyLong spacing>{t("papirIntro")}</BodyLong>
            <List as="ol" size="small">
                <ListItem>{t("papirStep1")}</ListItem>
                <ListItem>{t("papirStep2")}</ListItem>
                <ListItem>{t("papirStep3")}</ListItem>
                <ListItem>{t("papirStep4")}</ListItem>
            </List>
            <BodyLong spacing>{t("papirSkanner")}</BodyLong>
            <Heading level="3" size="xsmall">
                {t("nettsidesHeading")}
            </Heading>
            <BodyLong spacing>{t("nettsidesBody1")}</BodyLong>
            <BodyLong spacing>{t("nettsidesBody2")}</BodyLong>
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
        </ReadMore>
    );
};

export default DokKravReadMore;
