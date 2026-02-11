"use client";

import { BodyShort, Heading, HStack, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { FilePdfIcon } from "@navikt/aksel-icons";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { SakResponse } from "@generated/model";

import StatusTag from "../../../../../soknad/[id]/_components/saker/sak/StatusTag";

interface Props {
    sak: SakResponse;
}

const KlageVedtak = ({ sak }: Props) => {
    const t = useTranslations("KlageVedtak");

    if (!sak) return null;

    return (
        <VStack gap="4">
            <HStack gap="2">
                <Heading size="medium" level="2">
                    {sak.tittel}
                </Heading>
                <StatusTag vedtakUtfall={sak.utfallVedtak} className="self-start" />
            </HStack>
            <BodyShort>{t(`beskrivelse.${sak.utfallVedtak}`)}</BodyShort>
            {sak.vedtaksfilUrlList &&
                sak.vedtaksfilUrlList.map((fil, index) => (
                    <DigisosLinkCard
                        cardIcon="download"
                        key={index}
                        href={fil.url}
                        icon={<FilePdfIcon title={t("pdf")} />}
                        description={fil.dato}
                    >
                        {t("vedtaksBrev")}
                    </DigisosLinkCard>
                ))}
        </VStack>
    );
};

export default KlageVedtak;
