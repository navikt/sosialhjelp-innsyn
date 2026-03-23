"use client";

import { BankNoteIcon, EnvelopeClosedIcon } from "@navikt/aksel-icons";
import { BodyShort, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { VedtakDto } from "@generated/model";

import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface Props {
    sortedVedtak: VedtakDto[];
    latestVedtak: VedtakDto;
}

const Vedtak = ({ sortedVedtak, latestVedtak }: Props) => {
    const t = useTranslations("Vedtak");
    const latestItemRef = useRef<HTMLAnchorElement>(null);
    // Denne trigger rerendring på hash change (#vedtak), selv om den ikke brukes
    const params = useSearchParams();

    useEffect(() => {
        const link = latestItemRef.current;
        if (window.location.hash === "#vedtak" && link) {
            requestAnimationFrame(() => {
                link.scrollIntoView({ behavior: "smooth", block: "center" });
                // focusVisible tvinger :focus-visible pseudoclass på elementet. Funker ikke i alle browsere
                link.focus({ preventScroll: true, focusVisible: true });
            });
        }
    }, [params]);

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
                                    ref={isLatest ? latestItemRef : undefined}
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
