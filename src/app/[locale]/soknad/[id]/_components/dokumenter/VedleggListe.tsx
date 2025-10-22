"use client";

import { BodyShort, HStack, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { filesize } from "filesize";
import React from "react";

import { UrlResponse, VedleggResponse } from "@generated/model";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

import IkonBilde from "./IkonBilde";

export type SoknadFile = UrlResponse & { date?: string };

interface Props {
    vedlegg: VedleggResponse[];
}

const VedleggListe = ({ vedlegg }: Props) => {
    const t = useTranslations("VedleggListe");
    return (
        <VStack as="ul" gap="2">
            {vedlegg.map((fil) => (
                <>
                    <DigisosLinkCard
                        href={fil.url}
                        icon={IkonBilde(fil)}
                        underline={true}
                        cardIcon="expand"
                        description={
                            <>
                                <HStack gap="1">
                                    <BodyShort>{filesize(fil.storrelse)},</BodyShort>
                                    <BodyShort>
                                        {t.rich("lastetOpp", {
                                            norsk: (chunks) => <span lang="no">{chunks}</span>,
                                            dato: new Date(fil.datoLagtTil),
                                        })}
                                    </BodyShort>
                                </HStack>
                            </>
                        }
                    >
                        {fil.filnavn}
                    </DigisosLinkCard>
                </>
            ))}
        </VStack>
    );
};

export const VedleggListeSkeleton = () => (
    <VStack as="ul" gap="2" className="navds-file-item__inner">
        <HStack as="li" align="center" gap="2">
            <Skeleton variant="circle" height="48px" width="48px" />
            <VStack justify="center" gap="2">
                <Skeleton variant="rectangle" width="200px" />
                <Skeleton variant="rectangle" width="50px" />
            </VStack>
        </HStack>
    </VStack>
);

export default VedleggListe;
