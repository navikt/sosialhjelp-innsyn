import { BankNoteIcon, FilePdfIcon } from "@navikt/aksel-icons";
import { BodyShort } from "@navikt/ds-react";
import { useFormatter, useTranslations } from "next-intl";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { FilUrl, SaksStatusResponseUtfallVedtak } from "@generated/model";
import React from "react";
import useIsMobile from "@utils/useIsMobile";

interface Props {
    tittel: string;
    vedtakUtfall?: SaksStatusResponseUtfallVedtak;
    vedtaksliste?: FilUrl[];
}

const Vedtak = ({ vedtakUtfall, vedtaksliste }: Props) => {
    const t = useTranslations("Vedtak");
    const format = useFormatter();
    const isInnvilget = ["INNVILGET", "DELVIS_INNVILGET"].includes(vedtakUtfall ?? "");
    const isMobile = useIsMobile();
    const size = isMobile ? "small" : "medium";

    if (!vedtakUtfall) {
        return null;
    }
    // Sort vedtaksliste by date (newest first) and identify the newest vedtak
    const sortedVedtaksliste = vedtaksliste
        ? [...vedtaksliste].sort((a, b) => {
              const dateA = a.dato ? new Date(a.dato).getTime() : 0;
              const dateB = b.dato ? new Date(b.dato).getTime() : 0;
              return dateB - dateA; // Descending order (newest first)
          })
        : [];

    return (
        <>
            <BodyShort size={size}>{t(`beskrivelse.${vedtakUtfall}`)}</BodyShort>
            {sortedVedtaksliste &&
                sortedVedtaksliste.map((fil, index) => {
                    const isNewest = index === 0 && sortedVedtaksliste.length > 1;
                    return (
                        <DigisosLinkCard
                            cardIcon="download"
                            key={fil.id}
                            href={fil.url}
                            icon={<FilePdfIcon title={t("pdf")} />}
                            description={format.dateTime(new Date(fil.dato!), "short")}
                            analyticsEvent="knapp klikket"
                            analyticsData={{ tekst: "Åpner vedtak" }}
                        >
                            {isNewest ? t("vedtaksBrevNytt") : t("vedtaksBrev")}
                        </DigisosLinkCard>
                    );
                })}
            {isInnvilget && (
                <DigisosLinkCard href="/utbetaling" icon={<BankNoteIcon aria-hidden />}>
                    {t("kommendeUtbetaling")}
                </DigisosLinkCard>
            )}
        </>
    );
};

export default Vedtak;
