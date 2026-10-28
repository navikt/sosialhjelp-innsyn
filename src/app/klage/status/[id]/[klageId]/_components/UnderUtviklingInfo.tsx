import { Alert, BodyLong, Heading, Link } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

const UnderUtviklingInfo = async () => {
    const t = await getTranslations("KlagePage.underUtviklingInfo");

    return (
        <Alert variant="info">
            <Heading size="small" level="2" className="mb-2">
                {t("tittel")}
            </Heading>
            <BodyLong className="mb-4">{t("beskrivelse1")}</BodyLong>
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
        </Alert>
    );
};

export default UnderUtviklingInfo;
