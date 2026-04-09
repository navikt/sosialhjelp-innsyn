"use client";

import { BankNoteIcon, EnvelopeClosedIcon } from "@navikt/aksel-icons";
import { BodyShort, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { VedtakDto } from "@generated/model";

import React from "react";
import useFocusRef from "@hooks/useFocusRef";

interface Props {
    sortedVedtak: VedtakDto[];
    latestVedtak: VedtakDto;
}

const Vedtak = ({ sortedVedtak, latestVedtak }: Props) => {
    const t = useTranslations("Vedtak");

    const ref = useFocusRef<HTMLAnchorElement>("#vedtak");

    const isAnyInnvilget = sortedVedtak.some(
        (vedtak) => vedtak.utfall && ["INNVILGET", "DELVIS_INNVILGET"].includes(vedtak.utfall)
    );
    return (
        <>
            <BodyShort>{t(`beskrivelse.${latestVedtak.utfall}`)}</BodyShort>
            <VStack gap="space-8">
                <VStack gap="space-8" as="ol" aria-label={t("vedtaksbrev")}>
                    {sortedVedtak.map((vedtak, index) => {
                        const isNewest = index === 0 && sortedVedtak.length > 1;
                        const isLatest = index === 0;
                        return (
                            <li key={vedtak.id}>
                                <DigisosLinkCard
                                    cardIcon="external-link"
                                    openInNewTab
                                    ref={isLatest ? ref : undefined}
                                    href={vedtak.vedtaksFilUrl ?? ""}
                                    icon={<EnvelopeClosedIcon aria-hidden />}
                                    description={
                                        <BodyShort aria-hidden>
                                            {t("mottattDato", { dato: new Date(vedtak.dato!) })}
                                        </BodyShort>
                                    }
                                    analyticsEvent="knapp klikket"
                                    analyticsData={{ tekst: "Åpner vedtak" }}
                                >
                                    {isNewest ? t("vedtaksBrevNytt") : t("vedtaksBrev")}
                                    <span className="sr-only">
                                        , {t("mottattDato", { dato: new Date(vedtak.dato!) })}
                                    </span>
                                </DigisosLinkCard>
                            </li>
                        );
                    })}
                </VStack>
                {isAnyInnvilget && (
                    <DigisosLinkCard href="/utbetaling" icon={<BankNoteIcon aria-hidden />}>
                        {t("kommendeUtbetaling")}
                    </DigisosLinkCard>
                )}
            </VStack>
        </>
    );
};

export default Vedtak;
