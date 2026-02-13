"use client";

import { BodyShort, HStack, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { filesize } from "filesize";
import React from "react";
import * as R from "remeda";
import { VedleggResponse } from "@generated/model";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import useIsMobile from "@utils/useIsMobile";
import ExpandableList from "@components/showmore/ExpandableList";

import IkonBilde from "./IkonBilde";

interface Props {
    vedlegg: VedleggResponse[];
    labelledById?: string;
}

const VedleggListe = ({ vedlegg, labelledById = "opplastede-vedlegg" }: Props) => {
    const t = useTranslations("VedleggListe");
    const isMobile = useIsMobile();

    const sortedVedlegg = R.pipe(
        vedlegg,
        R.map((v, index) => ({ ...v, originalIndex: index })),
        R.sortBy([(v) => new Date(v.datoLagtTil).getTime(), "desc"], [(v) => v.originalIndex, "desc"])
    );

    return (
        <ExpandableList
            items={sortedVedlegg}
            id="vedlegg-liste"
            showMoreSuffix={t("visFlereDokumenter")}
            labelledById={labelledById}
            itemsLimit={3}
        >
            {(fil, index, firstExpandedItemRef, itemsLimit) => (
                <li key={fil.filnavn + index} ref={index === itemsLimit ? firstExpandedItemRef : null} tabIndex={-1}>
                    <DigisosLinkCard
                        href={fil.url}
                        icon={isMobile ? undefined : <IkonBilde filename={fil.filnavn} />}
                        cardIcon="external-link"
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
            )}
        </ExpandableList>
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
