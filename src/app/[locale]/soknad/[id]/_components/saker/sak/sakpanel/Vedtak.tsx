import { BankNoteIcon, FilePdfIcon } from "@navikt/aksel-icons";
import { BodyShort, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { VedtakDto } from "@generated/model";

import React from "react";
import useIsMobile from "@utils/useIsMobile";

interface Props {
    sortedVedtak: VedtakDto[];
    latestVedtak: VedtakDto;
}

const Vedtak = ({ sortedVedtak, latestVedtak }: Props) => {
    const t = useTranslations("Vedtak");
    const isMobile = useIsMobile();
    const size = isMobile ? "small" : "medium";
    const isAnyInnvilget = sortedVedtak.some(
        (vedtak) => vedtak.utfall && ["INNVILGET", "DELVIS_INNVILGET"].includes(vedtak.utfall)
    );
    return (
        <>
            <BodyShort size={size}>{t(`beskrivelse.${latestVedtak.utfall}`)}</BodyShort>
            <VStack gap="space-8">
                <VStack gap="space-8" as="ol" aria-label={t("vedtaksbrev")}>
                    {sortedVedtak.map((vedtak, index) => {
                        const isNewest = index === 0 && sortedVedtak.length > 1;
                        return (
                            <li key={vedtak.id}>
                                <DigisosLinkCard
                                    cardIcon="external-link"
                                    openInNewTab
                                    href={vedtak.vedtaksFilUrl ?? ""}
                                    icon={<FilePdfIcon title={t("pdf")} />}
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
