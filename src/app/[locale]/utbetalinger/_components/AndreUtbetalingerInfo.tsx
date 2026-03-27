"use client";

import { BodyLong, InfoCard, Link as AkselLink } from "@navikt/ds-react";
import { InfoCardContent, InfoCardHeader, InfoCardTitle } from "@navikt/ds-react/InfoCard";
import { InformationSquareIcon } from "@navikt/aksel-icons";
import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";

const AndreUtbetalingerInfo = () => {
    const t = useTranslations("AndreUtbetalingerInfo");

    return (
        <InfoCard as="section" data-color="info" aria-labelledby="andre-utbetalinger-title">
            <InfoCardHeader icon={<InformationSquareIcon aria-hidden />}>
                <InfoCardTitle id="andre-utbetalinger-title" as="h2">
                    {t("tittel")}
                </InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
                <BodyLong>
                    {t.rich("beskrivelse", {
                        lenke: (chunks) => (
                            <AkselLink as={Link} href="https://www.nav.no/utbetalingsoversikt">
                                {chunks}
                            </AkselLink>
                        ),
                    })}
                </BodyLong>
            </InfoCardContent>
        </InfoCard>
    );
};

export default AndreUtbetalingerInfo;
