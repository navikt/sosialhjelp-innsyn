import { BodyLong, BodyShort, Link, ReadMore } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

const VilkarReadMore = () => {
    const t = useTranslations("VilkarReadMore");
    return (
        <ReadMore header={t("header")}>
            <BodyLong spacing>{t("beskrivelse")}</BodyLong>
            <BodyShort>
                {t.rich("beskrivelse2", {
                    lenke: (chunks) => (
                        <Link href="https://www.nav.no/okonomisk-sosialhjelp#vilkar" inlineText>
                            {chunks}
                        </Link>
                    ),
                })}
            </BodyShort>
        </ReadMore>
    );
};

export default VilkarReadMore;
