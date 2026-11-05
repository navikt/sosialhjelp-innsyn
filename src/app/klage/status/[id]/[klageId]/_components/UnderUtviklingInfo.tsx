import { BodyLong, Link } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { InfoCard, InfoCardContent, InfoCardHeader, InfoCardTitle } from "@navikt/ds-react/InfoCard";
import { InformationSquareIcon } from "@navikt/aksel-icons";

const UnderUtviklingInfo = async () => {
    const t = await getTranslations("KlagePage.underUtviklingInfo");

    return (
        <InfoCard data-color="info">
            <InfoCardHeader icon={<InformationSquareIcon aria-hidden />}>
                <InfoCardTitle as="h2">{t("tittel")}</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
                <BodyLong spacing>{t("beskrivelse1")}</BodyLong>
                <BodyLong>
                    {t.rich("beskrivelse2", {
                        klageInfo: (chunks) => (
                            <Link href="https://www.nav.no/klagerettigheter" inlineText>
                                {chunks}
                            </Link>
                        ),
                        navKontor: (chunks) => (
                            <Link href="https://www.nav.no/sok-nav-kontor" inlineText>
                                {chunks}
                            </Link>
                        ),
                        tel: (chunks) => (
                            <Link href="tel:+4755553333" inlineText>
                                {chunks}
                            </Link>
                        ),
                    })}
                </BodyLong>
            </InfoCardContent>
        </InfoCard>
    );
};

export default UnderUtviklingInfo;
