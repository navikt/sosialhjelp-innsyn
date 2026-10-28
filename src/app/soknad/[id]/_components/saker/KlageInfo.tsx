import { Button, Link as AkselLink, Heading, BodyLong, VStack } from "@navikt/ds-react";
import { GavelIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { KlageRef } from "@generated/model";
import { useFlag } from "@featuretoggles/context";
import { Link } from "@i18n/navigation";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

interface Props {
    vedtakId: string;
    innsendtKlage?: KlageRef;
}

const KlageInfo = ({ vedtakId, innsendtKlage }: Props) => {
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
        <VStack gap="space-16" align="start">
            <VStack gap="space-8">
                <Heading size="small" level="3">
                    {t("tittel")}
                </Heading>
                <BodyLong>
                    {t.rich("beskrivelse", {
                        klageinfo: (chunks) => (
                            <AkselLink href="https://www.nav.no/okonomisk-sosialhjelp#klage" inlineText>
                                {chunks}
                            </AkselLink>
                        ),
                        klageskjema: (chunks) => (
                            <AkselLink href="/sosialhjelp/innsyn/papirskjema_klage.pdf" inlineText>
                                {chunks}
                            </AkselLink>
                        ),
                    })}
                </BodyLong>
            </VStack>
            {klageToggle.enabled && (
                <Button
                    icon={<GavelIcon aria-hidden />}
                    variant="secondary"
                    className="mt-4"
                    href={`/klage/opprett/${fiksDigisosId}/${vedtakId}`}
                    as={Link}
                >
                    {t("klageKnapp")}
                </Button>
            )}
        </VStack>
    );
};

export default KlageInfo;
