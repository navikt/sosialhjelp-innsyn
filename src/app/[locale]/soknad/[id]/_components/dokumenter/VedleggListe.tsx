"use client";

import { BodyShort, HStack, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { filesize } from "filesize";
import React from "react";
import { VedleggResponse } from "@generated/model";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import useIsMobile from "@utils/useIsMobile";

import IkonBilde from "./IkonBilde";

interface Props {
    vedlegg: VedleggResponse[];
}

const VedleggListe = ({ vedlegg }: Props) => {
    const t = useTranslations("VedleggListe");
    const isMobile = useIsMobile();

    const sortedVedlegg = vedlegg.toSorted(
        (a, b) => new Date(b.datoLagtTil).getTime() - new Date(a.datoLagtTil).getTime()
    );

    return (
        <VStack as="ul" gap="2">
            {sortedVedlegg.map((fil, index) => (
                <li key={fil.filnavn + index}>
                    <DigisosLinkCard
                        href={fil.url}
                        icon={isMobile ? undefined : <IkonBilde filename={fil.filnavn} />}
                        cardIcon="externalLink"
                        dataColor={isMobile ? "accent" : "neutral"}
                        description={
                            isMobile ? (
                                <BodyShort>
                                    {t.rich("sendt", {
                                        dato: new Date(fil.datoLagtTil),
                                    })}
                                </BodyShort>
                            ) : (
                                <HStack gap="1">
                                    <BodyShort>{filesize(fil.storrelse)},</BodyShort>
                                    <BodyShort>
                                        {t.rich("lastetOpp", {
                                            dato: new Date(fil.datoLagtTil),
                                        })}
                                    </BodyShort>
                                </HStack>
                            )
                        }
                    >
                        {fil.filnavn}
                    </DigisosLinkCard>
                </li>
            ))}
        </VStack>
    );
};

export const VedleggListeSkeleton = () => {
    const isMobile = useIsMobile();

    return (
        <VStack as="ul" gap="2" className="navds-file-item__inner">
            {isMobile ? (
                <VStack as="li" justify="center" gap="2">
                    <Skeleton variant="rectangle" width="200px" />
                    <Skeleton variant="rectangle" width="100px" />
                </VStack>
            ) : (
                <HStack as="li" align="center" gap="2">
                    <Skeleton variant="circle" height="48px" width="48px" />
                    <VStack justify="center" gap="2">
                        <Skeleton variant="rectangle" width="200px" />
                        <Skeleton variant="rectangle" width="50px" />
                    </VStack>
                </HStack>
            )}
        </VStack>
    );
};

export default VedleggListe;
