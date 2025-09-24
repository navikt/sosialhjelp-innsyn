"use client";

import { FilePdfIcon } from "@navikt/aksel-icons";
import { BodyShort, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { FilUrl, SaksStatusResponseUtfallVedtak } from "@generated/model";

interface Props {
    vedtakUtfall: SaksStatusResponseUtfallVedtak;
    vedtaksliste?: FilUrl[];
}

const KlageVedtakContainer = ({ vedtakUtfall, vedtaksliste }: Props) => {
    const t = useTranslations("Vedtak");

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
                    >
                        {t("vedtaksBrev")}
                    </DigisosLinkCard>
                ))}
        </VStack>
    );
};

export default KlageVedtakContainer;
