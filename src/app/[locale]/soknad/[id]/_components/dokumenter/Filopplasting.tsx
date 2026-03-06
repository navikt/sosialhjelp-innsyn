"use client";

import { Heading, VStack, Box, BodyLong } from "@navikt/ds-react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { useTranslations } from "next-intl";
import OpplastingsboksTus from "@components/filopplasting/new/OpplastingsboksTus";
import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";
import { Metadata } from "@components/filopplasting/new/types";
import { useHentVedleggSuspense } from "@generated/vedlegg-controller/vedlegg-controller";
import useIsMobile from "@utils/useIsMobile";

import VedleggListe, { VedleggListeSkeleton } from "./VedleggListe";
import { useHentOriginalSoknadSuspense } from "@generated/soknads-status-controller/soknads-status-controller";

const metadata = { dokumentKontekst: "ettersendelse", type: "annet", tilleggsinfo: "annet" } satisfies Metadata;

interface Props {
    id: string;
    newUploadEnabled: boolean;
}

const Filopplasting = ({ id, newUploadEnabled }: Props) => {
    const t = useTranslations("Filopplasting");
    const tOpplastingsboks = useTranslations("Opplastingsboks");
    const isMobile = useIsMobile();

    const { data: vedlegg } = useHentVedleggSuspense(id);
    const { data: originalSoknad } = useHentOriginalSoknadSuspense(id);

    return (
        <VStack>
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            {!isMobile && <BodyLong>{tOpplastingsboks("beskrivelse")}</BodyLong>}
            <Box background="info-soft" padding="space-24" borderRadius="12" borderWidth="1" borderColor="info-subtle">
                <VStack gap="space-40">
                    <VStack gap={isMobile ? "space-16" : "space-40"}>
                        {isMobile && <BodyLong>{tOpplastingsboks("beskrivelse")}</BodyLong>}
                        <NavigationGuardProvider>
                            {newUploadEnabled ? (
                                <OpplastingsboksTus metadata={metadata} id={id} />
                            ) : (
                                <Opplastingsboks metadata={metadata} />
                            )}
                        </NavigationGuardProvider>
                    </VStack>
                    {(vedlegg.length > 0 || originalSoknad) && (
                        <VStack gap="space-8">
                            <Heading size="small" level="3" id="dokumenter">
                                {t("opplastedeVedlegg")}
                            </Heading>
                            <VedleggListe vedlegg={vedlegg} originalSoknad={originalSoknad} labelledById="dokumenter" />
                        </VStack>
                    )}
                </VStack>
            </Box>
        </VStack>
    );
};
export const FilopplastingSkeleton = () => {
    const t = useTranslations("Filopplasting");
    return (
        <VStack>
            <Heading size="small" level="3" spacing>
                {t("tittel")}
            </Heading>
            <VedleggListeSkeleton />
        </VStack>
    );
};

export default Filopplasting;
