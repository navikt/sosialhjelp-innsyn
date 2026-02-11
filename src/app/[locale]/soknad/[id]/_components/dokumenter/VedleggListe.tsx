"use client";

import { BodyShort, HStack, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { filesize } from "filesize";
import React from "react";
import * as R from "remeda";
import { FileIcon } from "@navikt/aksel-icons";
import { OriginalSoknadDto, VedleggResponse } from "@generated/model";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import useIsMobile from "@utils/useIsMobile";
import ExpandableList from "@components/showmore/ExpandableList";

interface Props {
    vedlegg: VedleggResponse[];
    originalSoknad?: OriginalSoknadDto;
    labelledById?: string;
}

const VedleggListe = ({ vedlegg, originalSoknad, labelledById = "opplastede-vedlegg" }: Props) => {
    const t = useTranslations("VedleggListe");
    const isMobile = useIsMobile();

    const sortedVedlegg = R.pipe(
        vedlegg,
        R.map((v, index) => ({ ...v, originalIndex: index })),
        R.sortBy([(v) => new Date(v.datoLagtTil).getTime(), "desc"], [(v) => v.originalIndex, "desc"]),
        (vedlegg) => (originalSoknad ? [{ soknad: true, ...originalSoknad }, ...vedlegg] : vedlegg)
    );

    return (
        <ExpandableList
            items={sortedVedlegg}
            id="vedlegg-liste"
            showMoreSuffix={t("visFlereDokumenter")}
            labelledById={labelledById}
            itemsLimit={3}
        >
            {(fil, ref) => {
                if ("soknad" in fil) {
                    return (
                        <li key="soknad" ref={ref} tabIndex={-1}>
                            <DigisosLinkCard
                                href={fil.url}
                                icon={<FileIcon aria-hidden />}
                                cardIcon="external-link"
                                description={
                                    isMobile && fil.date ? (
                                        <BodyShort>
                                            {t.rich("sendt", {
                                                dato: new Date(fil.date),
                                            })}
                                        </BodyShort>
                                    ) : (
                                        <HStack gap="space-4" align="center">
                                            {fil.size ? <BodyShort>{filesize(fil.size)},</BodyShort> : undefined}
                                            {fil.date && (
                                                <BodyShort>
                                                    {t.rich("lastetOpp", {
                                                        dato: new Date(fil.date),
                                                    })}
                                                </BodyShort>
                                            )}
                                        </HStack>
                                    )
                                }
                            >
                                {fil.filename?.length ? fil.filename : t("soknadFilename")}
                            </DigisosLinkCard>
                        </li>
                    );
                }
                return (
                    <li key={fil.filnavn + fil.originalIndex} ref={ref} tabIndex={-1}>
                        <DigisosLinkCard
                            href={fil.url}
                            cardIcon="external-link"
                            dataColor="accent"
                            description={
                                isMobile ? (
                                    <BodyShort>
                                        {t.rich("sendt", {
                                            dato: new Date(fil.datoLagtTil),
                                        })}
                                    </BodyShort>
                                ) : (
                                    <HStack gap="space-4">
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
                );
            }}
        </ExpandableList>
    );
};

export const VedleggListeSkeleton = () => {
    const isMobile = useIsMobile();

    return (
        <VStack as="ul" gap="space-8" className="navds-file-item__inner">
            {isMobile ? (
                <VStack as="li" justify="center" gap="space-8">
                    <Skeleton variant="rectangle" width="200px" />
                    <Skeleton variant="rectangle" width="100px" />
                </VStack>
            ) : (
                <HStack as="li" align="center" gap="space-8">
                    <Skeleton variant="circle" height="48px" width="48px" />
                    <VStack justify="center" gap="space-8">
                        <Skeleton variant="rectangle" width="200px" />
                        <Skeleton variant="rectangle" width="50px" />
                    </VStack>
                </HStack>
            )}
        </VStack>
    );
};

export default VedleggListe;
