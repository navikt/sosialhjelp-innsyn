"use client";

import { BodyLong, Heading, Link as AkselLink, VStack } from "@navikt/ds-react";
import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";

const AndreUtbetalingerInfo = () => {
    const t = useTranslations("AndreUtbetalingerInfo");

    return (
        <VStack>
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <BodyLong>
                {t.rich("beskrivelse", {
                    lenke: (chunks) => (
                        <AkselLink as={Link} href="https://www.nav.no/utbetalingsoversikt">
                            {chunks}
                        </AkselLink>
                    ),
                })}
            </BodyLong>
        </VStack>
    );
};

export default AndreUtbetalingerInfo;
