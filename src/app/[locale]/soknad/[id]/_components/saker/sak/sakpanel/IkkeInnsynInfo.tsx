import { BodyLong, Box, Link } from "@navikt/ds-react";
import { useLocale, useTranslations } from "next-intl";

const IkkeInnsynInfo = () => {
    const t = useTranslations("IkkeInnsynInfo");
    const locale = useLocale();
    const localeSuffix = locale === "nb" ? "" : `/${locale}`;
    return (
        <Box>
            <BodyLong spacing>{t("description1")}</BodyLong>
            <BodyLong>
                {t.rich("description2", {
                    navKontorLenke: (chunks) => (
                        <Link inlineText href={`https://www.nav.no/sok-nav-kontor${localeSuffix}`}>
                            {chunks}
                        </Link>
                    ),
                    tlf: (chunks) => (
                        <Link inlineText href="tel:55553333">
                            {chunks}
                        </Link>
                    ),
                })}
            </BodyLong>
        </Box>
    );
};

export default IkkeInnsynInfo;
