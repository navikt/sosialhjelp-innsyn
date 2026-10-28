import { BodyLong, Link, ReadMore } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

const VilkarReadMore = () => {
    const t = useTranslations("VilkarReadMore");
    return (
        <ReadMore header={t("header")}>
            <BodyLong spacing>{t("beskrivelse")}</BodyLong>
            <BodyLong spacing>
                {t.rich("beskrivelse2", {
                    lenke: (chunks) => (
                        <Link href="https://www.nav.no/okonomisk-sosialhjelp#vilkar" inlineText>
                            {chunks}
                        </Link>
                    ),
                })}
            </BodyLong>
            <BodyLong>{t("beskrivelse3")}</BodyLong>
        </ReadMore>
    );
};

export default VilkarReadMore;
