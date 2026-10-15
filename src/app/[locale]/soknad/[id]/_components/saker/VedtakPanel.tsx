import { BankNoteIcon, EnvelopeClosedIcon } from "@navikt/aksel-icons";
import { Box, BodyShort, VStack } from "@navikt/ds-react";
import { KlageRef, VedtakDto } from "@generated/model";
import { useTranslations } from "next-intl";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import KlageInfo from "./KlageInfo";
import VedtakTittel from "./VedtakTittel";

interface Props {
    vedtak: VedtakDto;
    innsendtKlage?: KlageRef;
}

const VedtakPanel = ({ vedtak, innsendtKlage }: Props) => {
    const t = useTranslations("Vedtak");
    const visKommendeUtbetalingerLenke = vedtak.utfall === "INNVILGET" || vedtak.utfall === "DELVIS_INNVILGET";

    return (
        <Box borderWidth="1" borderColor="neutral-subtle" borderRadius="12" overflow="hidden">
            <VStack gap="space-16" padding={{ xs: "space-16", md: "space-24" }}>
                <VedtakTittel utfall={vedtak.utfall} dato={vedtak.dato} />
                {vedtak.utfall && <BodyShort>{t(`beskrivelse.${vedtak.utfall}`)}</BodyShort>}
                <VStack gap="space-8">
                    <DigisosLinkCard
                        cardIcon="external-link"
                        openInNewTab
                        href={vedtak.vedtaksFilUrl}
                        icon={<EnvelopeClosedIcon aria-hidden />}
                        description={
                            vedtak.dato ? (
                                <BodyShort aria-hidden>{t("mottattDato", { dato: new Date(vedtak.dato) })}</BodyShort>
                            ) : undefined
                        }
                        analyticsEvent="knapp klikket"
                        analyticsData={{ tekst: "Åpner vedtak" }}
                        className={"wrap-break-word"}
                    >
                        {t("vedtaksBrev")}
                        {vedtak.dato && (
                            <span className="sr-only">, {t("mottattDato", { dato: new Date(vedtak.dato) })}</span>
                        )}
                    </DigisosLinkCard>
                    {visKommendeUtbetalingerLenke && (
                        <DigisosLinkCard
                            href="/utbetaling"
                            icon={<BankNoteIcon aria-hidden />}
                            className={"wrap-break-word"}
                        >
                            {t("kommendeUtbetaling")}
                        </DigisosLinkCard>
                    )}
                </VStack>
            </VStack>
            <Box
                padding={{ xs: "space-20", md: "space-24" }}
                borderWidth="1 0 0 0"
                borderColor="neutral-subtle"
                background="neutral-soft"
            >
                <KlageInfo innsendtKlage={innsendtKlage} vedtakId={vedtak.id} />
            </Box>
        </Box>
    );
};

export default VedtakPanel;
