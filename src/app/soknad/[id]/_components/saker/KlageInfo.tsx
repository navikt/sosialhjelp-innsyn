import { Link as AkselLink, BodyLong, VStack, Heading } from "@navikt/ds-react";
import { GavelIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { KlageRef } from "@generated/model";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import useKlageEnabled from "@hooks/useKlageEnabled";
import { addWeeks, parseISO } from "date-fns";
import { ReactNode } from "react";

interface Props {
    vedtakId: string;
    vedtaksdato: string;
    innsendtKlage?: KlageRef;
}

const KlageInfo = ({ vedtakId, vedtaksdato, innsendtKlage }: Props) => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    const t = useTranslations("KlageInfo");
    const klageEnabled = useKlageEnabled(fiksDigisosId);

    if (innsendtKlage) {
        return (
            <DigisosLinkCard
                href={`/klage/status/${fiksDigisosId}/${innsendtKlage.klageId}`}
                icon={<GavelIcon aria-hidden />}
                dataColor="accent"
            >
                {t("seKlage")}
            </DigisosLinkCard>
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
