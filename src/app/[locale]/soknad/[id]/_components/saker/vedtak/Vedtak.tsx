import { BankNoteIcon, FilePdfIcon } from "@navikt/aksel-icons";
import { BodyShort, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { KlageRef, VedtakDto } from "@generated/model";

import KlageInfo from "./KlageInfo";

interface Props {
    innsendtKlage?: KlageRef;
    vedtak: VedtakDto[];
}

const Vedtak = ({ innsendtKlage, vedtak }: Props) => {
    const t = useTranslations("Vedtak");
    const isAnyInnvilget = vedtak.some(
        (vedtak) => vedtak.utfall && ["INNVILGET", "DELVIS_INNVILGET"].includes(vedtak.utfall)
    );
    // Sort vedtaksliste by date (newest first) and identify the newest vedtak
    const sortedVedtaksliste =
        vedtak?.toSorted((a, b) => {
            const dateA = a.dato ? new Date(a.dato).getTime() : 0;
            const dateB = b.dato ? new Date(b.dato).getTime() : 0;
            return dateB - dateA; // Descending order (newest first)
        }) ?? [];

    const latestVedtak = sortedVedtaksliste[0];
    return (
        <VStack gap="4">
            <BodyShort>{t(`beskrivelse.${latestVedtak.utfall}`)}</BodyShort>
            {sortedVedtaksliste.map((vedtak, index) => {
                const isNewest = index === 0 && sortedVedtaksliste.length > 1;
                return (
                    <DigisosLinkCard
                        cardIcon="download"
                        key={vedtak.id}
                        href={vedtak.vedtaksFilUrl ?? ""}
                        icon={<FilePdfIcon title={t("pdf")} />}
                        description={vedtak.dato}
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
            <KlageInfo latestVedtak={latestVedtak} innsendtKlage={innsendtKlage} />
        </VStack>
    );
};

export default Vedtak;
