"use client";

import { BodyShort, HStack, InlineMessage, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import * as R from "remeda";
import { OriginalSoknadDto, VedleggResponse } from "@generated/model";
import { OppgaveVedleggFil } from "@generated/model/oppgaveVedleggFil";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import useIsMobile from "@utils/useIsMobile";
import ExpandableList from "@components/showmore/ExpandableList";
import { getVisningstekster } from "@utils/getVisningsteksterForVedlegg";

interface Props {
    vedlegg: (VedleggResponse | OppgaveVedleggFil)[];
    originalSoknad?: OriginalSoknadDto;
    labelledById: string;
    oppgaveBeskrivelse?: string;
}

const VedleggListe = ({ vedlegg, originalSoknad, labelledById, oppgaveBeskrivelse }: Props) => {
    const t = useTranslations("VedleggListe");

    const originalSoknadErSkjult = originalSoknad?.skjult ?? false;

    const alleVedlegg = [
        ...(originalSoknad && !originalSoknad.skjult
            ? [{ soknad: true as const, ...originalSoknad, datoLagtTil: originalSoknad.date }]
            : []),
        ...vedlegg.map((v, index) => ({ ...v, originalIndex: index })),
    ];

    const getDato = (v: (typeof alleVedlegg)[number]) =>
        "tidspunktLastetOpp" in v ? v.tidspunktLastetOpp : (v.datoLagtTil ?? 0);

    const sortedVedlegg = R.sortBy(
        alleVedlegg,
        [(v) => new Date(getDato(v)).getTime(), "desc"],
        [(v) => ("originalIndex" in v ? v.originalIndex : 0), "desc"]
    );

    return (
        <VStack gap="space-8">
            {originalSoknadErSkjult && (
                <InlineMessage
                    status={"info"}
                    className="border border-ax-border-info-subtle bg-ax-bg-info-moderate p-2 rounded-xl"
                >
                    {t("skjultSoknadPdf")}
                </InlineMessage>
            )}
            {sortedVedlegg.length > 0 && (
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
                                        openInNewTab
                                        cardIcon="external-link"
                                        dataColor="accent"
                                        description={
                                            fil.date && (
                                                <BodyShort>{t.rich("sendt", { dato: new Date(fil.date) })}</BodyShort>
                                            )
                                        }
                                    >
                                        {fil.filename?.length ? fil.filename : t("soknadFilename")}
                                    </DigisosLinkCard>
                                </li>
                            );
                        }
                        if ("tidspunktLastetOpp" in fil) {
                            return (
                                <li key={fil.url} ref={ref} tabIndex={-1}>
                                    <DigisosLinkCard
                                        href={fil.url}
                                        cardIcon="external-link"
                                        dataColor="accent"
                                        openInNewTab
                                        description={
                                            <BodyShort>
                                                {oppgaveBeskrivelse} (
                                                {t("sendt", { dato: new Date(fil.tidspunktLastetOpp) })})
                                            </BodyShort>
                                        }
                                    >
                                        {fil.filnavn}
                                    </DigisosLinkCard>
                                </li>
                            );
                        }
                        return (
                            <li key={fil.filnavn + fil.originalIndex} ref={ref} tabIndex={-1}>
                                <DigisosLinkCard
                                    href={fil.url}
                                    openInNewTab
                                    cardIcon="external-link"
                                    dataColor="accent"
                                    description={
                                        <BodyShort>
                                            {fil.type === "annet" && fil.tilleggsinfo === "annet"
                                                ? t("ettersendt")
                                                : getVisningstekster(fil.type, fil.tilleggsinfo).typeTekst}{" "}
                                            ({t("sendt", { dato: new Date(fil.datoLagtTil) })})
                                        </BodyShort>
                                    }
                                >
                                    {fil.filnavn}
                                </DigisosLinkCard>
                            </li>
                        );
                    }}
                </ExpandableList>
            )}
        </VStack>
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
