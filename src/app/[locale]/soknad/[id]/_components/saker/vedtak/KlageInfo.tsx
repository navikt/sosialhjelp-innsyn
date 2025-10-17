import { Button, Link as AkselLink, Heading } from "@navikt/ds-react";
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
            <DigisosLinkCard href={`/klage/status/${fiksDigisosId}/${innsendtKlage.klageId}`} icon={<GavelIcon />}>
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
            {klageToggle.enabled && newestVedtak && (
                <Button
                    icon={<GavelIcon />}
                    variant="secondary"
                    className="mt-4"
                    href={`/klage/opprett/${fiksDigisosId}/${newestVedtak.id}`}
                    as={Link}
                >
                    {t("klageKnapp")}
                </Button>
            )}
        </div>
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
