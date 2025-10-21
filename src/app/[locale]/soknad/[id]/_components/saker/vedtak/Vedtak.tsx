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

    return (
        <VStack gap="4">
            <BodyShort>{t(`beskrivelse.${vedtakUtfall}`)}</BodyShort>
            {vedtaksliste &&
                vedtaksliste.map((fil, index) => (
                    <DigisosLinkCard
                        downloadIcon={true}
                        key={index}
                        href={fil.url}
                        icon={<FilePdfIcon />}
                        description={fil.dato}
                        analyticsEvent="knapp klikket"
                        analyticsData={{ tekst: "Åpner vedtak" }}
                    >
                        {t("vedtaksBrev")}
                    </DigisosLinkCard>
                ))}
            {isInnvilget && (
                <DigisosLinkCard href="/utbetaling" icon={<BankNoteIcon />}>
                    {t("kommendeUtbetaling")}
                </DigisosLinkCard>
            )}
            <KlageInfo vedtaksliste={vedtaksliste} innsendtKlage={innsendtKlage} />
        </VStack>
    );
};

export default Vedtak;
