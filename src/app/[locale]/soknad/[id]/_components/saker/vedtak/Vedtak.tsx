import { BankNoteIcon, FilePdfIcon } from "@navikt/aksel-icons";
import { BodyShort, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { FilUrl, KlageRef, SaksStatusResponseUtfallVedtak } from "@generated/model";

import KlageInfo from "./KlageInfo";

interface Props {
    vedtakUtfall: SaksStatusResponseUtfallVedtak;
    vedtaksliste?: FilUrl[];
    innsendtKlage?: KlageRef;
}

const Vedtak = ({ vedtakUtfall, vedtaksliste, innsendtKlage }: Props) => {
    const t = useTranslations("Vedtak");
    const isInnvilget = ["INNVILGET", "DELVIS_INNVILGET"].includes(vedtakUtfall);

    // Sort vedtaksliste by date (newest first) and identify the newest vedtak
    const sortedVedtaksliste = vedtaksliste
        ? [...vedtaksliste].sort((a, b) => {
              const dateA = a.dato ? new Date(a.dato).getTime() : 0;
              const dateB = b.dato ? new Date(b.dato).getTime() : 0;
              return dateB - dateA; // Descending order (newest first)
          })
        : [];

    return (
        <VStack gap="4">
            <BodyShort>{t(`beskrivelse.${vedtakUtfall}`)}</BodyShort>
            {sortedVedtaksliste &&
                sortedVedtaksliste.map((fil, index) => {
                    const isNewest = index === 0 && sortedVedtaksliste.length > 1;
                    return (
                        <DigisosLinkCard
                            cardIcon="download"
                            key={fil.id}
                            href={fil.url}
                            icon={<FilePdfIcon title={t("pdf")} />}
                            description={fil.dato}
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
            <KlageInfo vedtaksliste={vedtaksliste} innsendtKlage={innsendtKlage} />
        </VStack>
    );
};

export default Vedtak;
