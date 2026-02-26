"use client";

import { BodyShort, HStack, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
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
    labelledById: string;
}

const VedleggListe = ({ vedlegg, originalSoknad, labelledById }: Props) => {
    const t = useTranslations("VedleggListe");

    const sortedVedlegg = R.pipe(
        vedlegg,
        R.map((v, index) => ({ ...v, originalIndex: index })),
        R.sortBy([(v) => new Date(v.datoLagtTil).getTime(), "desc"], [(v) => v.originalIndex, "desc"]),
        (vedlegg) => (originalSoknad ? [{ soknad: true, ...originalSoknad }, ...vedlegg] : vedlegg)
    );

    // 🔍 DEBUG: Logger vedlegg data for dev miljø (synlig i browser console)
    /* eslint-disable no-console */
    console.log("=== VedleggListe Debug ===");
    console.log("Antall ettersendelse vedlegg:", vedlegg.length);
    console.log(
        "Ettersendelse vedlegg:",
        vedlegg.map((v) => ({
            filnavn: v.filnavn,
            type: v.type,
            tilleggsinfo: v.tilleggsinfo,
            datoLagtTil: v.datoLagtTil,
        }))
    );
    console.log(
        "OriginalSoknad:",
        originalSoknad ? { filename: originalSoknad.filename, date: originalSoknad.date } : null
    );
    console.log("Totalt i sortert liste (inkl. søknad):", sortedVedlegg.length);
    console.log("==========================");
    /* eslint-enable no-console */

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
                                    fil.date && (
                                        <BodyShort>
                                            {t.rich("sendt", {
                                                dato: new Date(fil.date),
                                            })}
                                        </BodyShort>
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
                                <BodyShort>
                                    {t.rich("sendt", {
                                        dato: new Date(fil.datoLagtTil),
                                    })}
                                </BodyShort>
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
