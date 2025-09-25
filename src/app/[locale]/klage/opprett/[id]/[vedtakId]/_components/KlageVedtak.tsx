"use client";

import { BodyShort, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { FilePdfIcon } from "@navikt/aksel-icons";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { SakResponse } from "@generated/model";

import Sakstittel from "../../../../../soknad/[id]/_components/saker/Sakstittel";

interface Props {
    sak: SakResponse;
}

const KlageVedtak = ({ sak }: Props) => {
    const t = useTranslations("KlageVedtak");

    if (!sak) return null;

    return (
        <VStack gap="4">
            <Sakstittel tittel={sak.tittel} vedtakUtfall={sak.utfallVedtak} fontSize="medium" />
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
