import { Button, Link as AkselLink, Heading } from "@navikt/ds-react";
import { GavelIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { KlageRef, VedtakDto } from "@generated/model";
import { useFlag } from "@featuretoggles/context";
import { Link } from "@i18n/navigation";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

interface Props {
    // En sak kan ha flere vedtak. Dette vil typisk være ved feilretting av tidligere vedtak og vi gir derfor kun mulighet til en klageknapp per sak.
    latestVedtak: VedtakDto;
    innsendtKlage?: KlageRef;
}

const KlageInfo = ({ innsendtKlage, latestVedtak }: Props) => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const t = useTranslations("KlageInfo");
    const klageToggle = useFlag("sosialhjelp.innsyn.klage");

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
        <div className="p-4 bg-ax-bg-info-soft rounded-lg">
            <Heading size="small" level="3">
                {t("tittel")}
            </Heading>
            <p>
                {t.rich("beskrivelse", {
                    lenke: (chunks) => (
                        <AkselLink href="https://www.nav.no/klagerettigheter" inlineText>
                            {chunks}
                        </AkselLink>
                    ),
                })}
            </p>
            {klageToggle.enabled && latestVedtak && (
                <Button
                    icon={<GavelIcon aria-hidden />}
                    variant="secondary"
                    className="mt-4"
                    href={`/klage/opprett/${fiksDigisosId}/${latestVedtak.id}`}
                    as={Link}
                >
                    {t("klageKnapp")}
                </Button>
            )}
        </div>
    );
};

export default KlageInfo;
