import { Button, Link as AkselLink, Heading } from "@navikt/ds-react";
import { GavelIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { FilUrl } from "@generated/model";
import { useFlag } from "@featuretoggles/context";
import { Link } from "@i18n/navigation";

interface Props {
    vedtaksliste?: FilUrl[];
}

const KlageInfo = ({ vedtaksliste }: Props) => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const t = useTranslations("Vedtak");
    const klageToggle = useFlag("sosialhjelp.innsyn.klage");

    // Siden en sak kan ha flere vedtak, velger vi nyeste vedtak basert på dato
    const newestVedtak = vedtaksliste?.reduce((newest, current) => {
        if (!current.dato) return newest;
        if (!newest.dato) return current;
        return new Date(current.dato) > new Date(newest.dato) ? current : newest;
    }, vedtaksliste[0]);

    return (
        <div className="p-4 bg-ax-bg-info-soft rounded-lg">
            <Heading size="small" level="3">
                {t("uenig.tittel")}
            </Heading>
            <p>
                {t.rich("uenig.beskrivelse", {
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
                    {t("uenig.klageKnapp")}
                </Button>
            )}
        </div>
    );
};

export default KlageInfo;
