"use client";

import { BodyLong, BodyShort, Link, ReadMore, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React from "react";

interface Props {
    navKontor: string;
}

const Behandlingstid = ({ navKontor }: Props) => {
    const t = useTranslations("Behandlingstid");
    return (
        <VStack gap="space-8">
            <BodyLong>
                {t.rich("vilBehandle", {
                    norsk: (chunks) => (
                        <BodyShort as="span" lang="no">
                            {chunks}
                        </BodyShort>
                    ),
                    navKontor: navKontor,
                })}
            </BodyLong>
            <ReadMore header={t("saksbehandlingstid.tittel")}>
                <BodyLong spacing>{t("saksbehandlingstid.beskrivelse1")}</BodyLong>
                <BodyLong weight="semibold">{t("saksbehandlingstid.beskrivelse2")}</BodyLong>
                <BodyLong>{t("saksbehandlingstid.beskrivelse3")}</BodyLong>
            </ReadMore>
            <ReadMore header={t("melde.tittel")}>
                <BodyLong spacing>
                    {t.rich(`melde.beskrivelse`, {
                        lenke: (chunks) => (
                            <Link href="https://www.nav.no/okonomisk-sosialhjelp#melde" inlineText>
                                {chunks}
                            </Link>
                        ),
                    })}
                </BodyLong>
                <BodyLong>
                    {t.rich("melde.beskrivelse2", {
                        tel: (chunks) => (
                            <Link href="tel:55553333" inlineText>
                                {chunks}
                            </Link>
                        ),
                    })}
                </BodyLong>
            </ReadMore>
        </VStack>
    );
};

export default Behandlingstid;
