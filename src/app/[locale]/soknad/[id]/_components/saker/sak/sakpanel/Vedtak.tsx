import { BankNoteIcon, FilePdfIcon } from "@navikt/aksel-icons";
import { BodyShort } from "@navikt/ds-react";
import { useFormatter, useTranslations } from "next-intl";
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
    const format = useFormatter();
    const isMobile = useIsMobile();
    const size = isMobile ? "small" : "medium";
    const isAnyInnvilget = sortedVedtak.some(
        (vedtak) => vedtak.utfall && ["INNVILGET", "DELVIS_INNVILGET"].includes(vedtak.utfall)
    );
    return (
        <>
            <BodyShort size={size}>{t(`beskrivelse.${latestVedtak.utfall}`)}</BodyShort>
            {sortedVedtak.map((vedtak, index) => {
                const isNewest = index === 0 && sortedVedtak.length > 1;
                return (
                    <DigisosLinkCard
                        cardIcon="download"
                        key={vedtak.id}
                        href={vedtak.vedtaksFilUrl ?? ""}
                        icon={<FilePdfIcon title={t("pdf")} />}
                        description={format.dateTime(new Date(vedtak.dato!), "short")}
                        analyticsEvent="knapp klikket"
                        analyticsData={{ tekst: "Åpner vedtak" }}
                    >
                        {isNewest ? t("vedtaksBrevNytt") : t("vedtaksBrev")}
                    </DigisosLinkCard>
                );
            })}
            {isAnyInnvilget && (
                <DigisosLinkCard href="/utbetaling" icon={<BankNoteIcon aria-hidden />}>
                    {t("kommendeUtbetaling")}
                </DigisosLinkCard>
            )}
        </>
    );
};

export default Vedtak;
