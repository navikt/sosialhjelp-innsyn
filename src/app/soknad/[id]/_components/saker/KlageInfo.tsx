import { Link as AkselLink, BodyLong, VStack, Heading } from "@navikt/ds-react";
import { PaperclipIcon, PersonGavelIcon } from "@navikt/aksel-icons";
import { useFormatter, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { KlageRef } from "@generated/model";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import useKlageEnabled from "@hooks/useKlageEnabled";
import { addWeeks, parseISO } from "date-fns";
import { ReactNode } from "react";
import { erEttersendelsesfristUtlopt, getEttersendelsesfrist } from "@utils/ettersendelsesfrist";

interface Props {
    vedtakId: string;
    vedtaksdato: string;
    innsendtKlage?: KlageRef;
}

const KlageInfo = ({ vedtakId, vedtaksdato, innsendtKlage }: Props) => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    const t = useTranslations("KlageInfo");
    const format = useFormatter();
    const klageEnabled = useKlageEnabled(fiksDigisosId);

    if (innsendtKlage) {
        const { timestampSendt } = innsendtKlage;
        const fristUtlopt = timestampSendt != null && erEttersendelsesfristUtlopt(timestampSendt);
        const description = fristUtlopt
            ? t("ettersendelsesfristUtlopt")
            : timestampSendt != null
              ? t("ettersendelsefrist", {
                    dato: format.dateTime(getEttersendelsesfrist(timestampSendt), {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        timeZone: "Europe/Oslo",
                    }),
                })
              : undefined;

        return (
            <VStack gap="space-16">
                <BodyLong>{t("duHarKlaget")}</BodyLong>
                <DigisosLinkCard
                    icon={fristUtlopt ? <PersonGavelIcon aria-hidden /> : <PaperclipIcon aria-hidden />}
                    href={`/klage/status/${fiksDigisosId}/${innsendtKlage.klageId}`}
                    dataColor="accent"
                    description={description}
                >
                    {t(fristUtlopt ? "seKlagen" : "ettersendKnapp")}
                </DigisosLinkCard>
            </VStack>
        );
    }

    if (klageEnabled) {
        return (
            <VStack gap="space-16">
                <BodyLong>
                    {t.rich("beskrivelse", {
                        klageinfo: KlageInfoLenke,
                    })}
                </BodyLong>
                <DigisosLinkCard
                    href={`/klage/opprett/${fiksDigisosId}/${vedtakId}`}
                    dataColor="accent"
                    description={t("klagefrist", { dato: addWeeks(parseISO(vedtaksdato), 3) })}
                >
                    {t("klageKnapp")}
                </DigisosLinkCard>
            </VStack>
        );
    }

    return (
        <VStack gap="space-8">
            <Heading size="small" level="3">
                {t("papirklage.tittel")}
            </Heading>
            <BodyLong>
                {t.rich("papirklage.beskrivelse", {
                    klageinfo: KlageInfoLenke,
                    klageskjema: (chunks) => (
                        <AkselLink href="/sosialhjelp/innsyn/papirskjema_klage.pdf" inlineText>
                            {chunks}
                        </AkselLink>
                    ),
                })}
            </BodyLong>
        </VStack>
    );
};

const KlageInfoLenke = (chunks: ReactNode) => (
    <AkselLink href="https://www.nav.no/okonomisk-sosialhjelp#klage" inlineText>
        {chunks}
    </AkselLink>
);

export default KlageInfo;
