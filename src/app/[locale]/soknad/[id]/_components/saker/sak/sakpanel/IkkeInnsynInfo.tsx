import { BodyLong, Link } from "@navikt/ds-react";
import { useLocale, useTranslations } from "next-intl";

const IkkeInnsynInfo = () => {
    const t = useTranslations("IkkeInnsynInfo");
    const locale = useLocale();
    const localeSuffix = locale === "nb" ? "" : `/${locale}`;
    return (
        <BodyLong>
            {t.rich("info", {
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
    );
};

export default IkkeInnsynInfo;
