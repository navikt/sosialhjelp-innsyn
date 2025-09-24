"use client";

import { BodyShort, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { FilePdfIcon } from "@navikt/aksel-icons";

import { useHentSakForVedtak } from "@generated/sak-controller/sak-controller";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

import Sakstittel from "../../../../../soknad/[id]/_components/saker/Sakstittel";

interface Props {
    fiksDigisosId: string;
    vedtakId: string;
}

const KlageVedtak = ({ fiksDigisosId, vedtakId }: Props) => {
    const { data: sak } = useHentSakForVedtak(fiksDigisosId, vedtakId);
    const t = useTranslations("Vedtak");

    if (!sak) return null;

    return (
        <VStack>
            <Sakstittel tittel={sak.tittel} vedtakUtfall={sak.utfallVedtak} />
            <BodyShort>{t(`beskrivelse.${sak.utfallVedtak}`)}</BodyShort>
            {sak.vedtaksfilUrlList &&
                sak.vedtaksfilUrlList.map((fil, index) => (
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

export default KlageVedtak;
