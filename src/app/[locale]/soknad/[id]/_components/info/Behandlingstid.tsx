"use client";

import { BodyLong, BodyShort, Link, ReadMore, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React from "react";
import { ExternalLinkIcon } from "@navikt/aksel-icons";

interface Props {
    navKontor: string;
}

const SaksbehandlingstidReadMore = () => {
    const t = useTranslations("Behandlingstid.ReadMore");
    return (
        <>
            <ReadMore header={t("saksbehandlingstid.tittel")}>
                <BodyLong spacing>{t("saksbehandlingstid.beskrivelse1")}</BodyLong>
                <BodyLong weight="semibold">{t("saksbehandlingstid.beskrivelse2")}</BodyLong>
                <BodyLong>{t("saksbehandlingstid.beskrivelse3")}</BodyLong>
            </ReadMore>
            <ReadMore header={t("melde.tittel")}>
                <BodyLong spacing>
                    {t.rich(`melde.beskrivelse`, {
                        lenke: (chunks) => (
                            <Link
                                href="https://www.nav.no/okonomisk-sosialhjelp#melde"
                                inlineText
                                target="_blank"
                                rel="noopener noreferrer"
                            >
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
        </>
    );
};

const ForlengetBehandlingstidDescription = ({ navKontor, forelopigSvarUrl }: Props & { forelopigSvarUrl?: string }) => {
    const t = useTranslations("Behandlingstid.Description");
    if (!forelopigSvarUrl) {
        return (
            <BodyLong>
                {t.rich("forlengetUtenBrev", {
                    norsk: (chunks) => (
                        <BodyShort as="span" lang="no">
                            {chunks}
                        </BodyShort>
                    ),
                    navKontor: navKontor,
                })}
            </BodyLong>
        );
    }
    return (
        <BodyLong>
            {t.rich("forlenget", {
                norsk: (chunks) => (
                    <BodyShort as="span" lang="no">
                        {chunks}
                    </BodyShort>
                ),
                lenke: (chunks) => (
                    <Link inlineText href={forelopigSvarUrl} target="_blank" rel="noopener noreferrer">
                        {chunks}
                        <ExternalLinkIcon aria-hidden />
                    </Link>
                ),
                navKontor: navKontor,
            })}
        </BodyLong>
    );
};

export const Behandlingstid = ({ navKontor }: Props) => {
    const t = useTranslations("Behandlingstid.Description");
    return (
        <BodyLong>
            {t.rich("normal", {
                norsk: (chunks) => (
                    <BodyShort as="span" lang="no">
                        {chunks}
                    </BodyShort>
                ),
                navKontor: navKontor,
            })}
        </BodyLong>
    );
};

export const ForlengetBehandlingstid = ({ navKontor, forelopigSvarUrl }: Props & { forelopigSvarUrl?: string }) => (
    <VStack gap="space-8">
        <ForlengetBehandlingstidDescription navKontor={navKontor} forelopigSvarUrl={forelopigSvarUrl} />
        <SaksbehandlingstidReadMore />
    </VStack>
);
