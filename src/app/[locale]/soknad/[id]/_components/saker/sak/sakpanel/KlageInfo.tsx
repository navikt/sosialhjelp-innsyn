import { Button, Link as AkselLink, Heading, BodyLong, VStack } from "@navikt/ds-react";
import { GavelIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { FilUrl, KlageRef } from "@generated/model";
import { useFlag } from "@featuretoggles/context";
import { Link } from "@i18n/navigation";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

interface Props {
    vedtaksliste?: FilUrl[];
    innsendtKlage?: KlageRef;
}

const KlageInfo = ({ vedtaksliste, innsendtKlage }: Props) => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const t = useTranslations("KlageInfo");
    const klageToggle = useFlag("sosialhjelp.innsyn.klage");
    const newestVedtak = findNewestVedtak(vedtaksliste);

    if (klageToggle.enabled && innsendtKlage) {
        return (
            <DigisosLinkCard
                href={`/klage/status/${fiksDigisosId}/${innsendtKlage.klageId}`}
                icon={<GavelIcon aria-hidden />}
            >
                {t("seKlage")}
            </DigisosLinkCard>
        );
    }

    return (
        <VStack gap="space-16" align="start">
            <Heading size="small" level="3">
                {t("tittel")}
            </Heading>
            <BodyLong>
                {t.rich("beskrivelse", {
                    lenke: (chunks) => (
                        <AkselLink href="https://www.nav.no/klagerettigheter" inlineText>
                            {chunks}
                        </AkselLink>
                    ),
                })}
            </BodyLong>
            {klageToggle.enabled && innsendtKlage && (
                <DigisosLinkCard
                    href={`/klage/status/${fiksDigisosId}/${innsendtKlage.klageId}`}
                    icon={<GavelIcon aria-hidden />}
                >
                    {t("seKlage")}
                </DigisosLinkCard>
            )}
            {klageToggle.enabled && !innsendtKlage && newestVedtak && (
                <Button
                    icon={<GavelIcon aria-hidden />}
                    variant="secondary"
                    className="mt-4"
                    href={`/klage/opprett/${fiksDigisosId}/${newestVedtak.id}`}
                    as={Link}
                >
                    {t("klageKnapp")}
                </Button>
            )}
        </VStack>
    );
};

// En sak kan ha flere vedtak. Dette vil typisk være ved feilretting av tidligere vedtak og vi gir derfor kun mulighet til en klageknapp per sak.
// Henter derfor ut det nyeste vedtaket basert på dato
const findNewestVedtak = (vedtaksliste?: FilUrl[]): FilUrl | undefined =>
    vedtaksliste?.reduce((newest, current) => {
        if (!current.dato) return newest;
        if (!newest.dato) return current;
        return new Date(current.dato) > new Date(newest.dato) ? current : newest;
    }, vedtaksliste[0]);

export default KlageInfo;
