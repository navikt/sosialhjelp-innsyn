"use client";

import { Heading, VStack, Box } from "@navikt/ds-react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { useTranslations } from "next-intl";
import OpplastingsboksTus from "@components/filopplasting/OpplastingsboksTus";
import Opplastingsboks from "@components/filopplasting/Opplastingsboks";
import { Metadata } from "@components/filopplasting/types";
import { useHentVedleggSuspense } from "@generated/vedlegg-controller/vedlegg-controller";
import useIsMobile from "@utils/useIsMobile";

import VedleggListe, { VedleggListeSkeleton } from "@components/filopplasting/VedleggListe";
import { useHentOriginalSoknadSuspense } from "@generated/soknads-status-controller/soknads-status-controller";
import { useHentSaksStatuserSuspense } from "@generated/saks-status-controller/saks-status-controller";
import { SoknadsStatusResponseStatus } from "@generated/model";
import TipsReadMore from "../TipsReadMore";
import useNewUploadEnabled from "@components/filopplasting/utils/useNewUploadEnabled";

const metadata = { dokumentKontekst: "ettersendelse", type: "annet", tilleggsinfo: "annet" } satisfies Metadata;

interface Props {
    id: string;
    soknadStatus: SoknadsStatusResponseStatus;
}

const Filopplasting = ({ id, soknadStatus }: Props) => {
    const t = useTranslations("Filopplasting");
    const isMobile = useIsMobile();

    const { data: vedlegg } = useHentVedleggSuspense(id);
    const { data: originalSoknad } = useHentOriginalSoknadSuspense(id);
    const { data: saker } = useHentSaksStatuserSuspense(id);
    const enSakIkkeInnsyn = saker.length === 1 && saker[0].status === "IKKE_INNSYN";
    const behandlesIkke =
        soknadStatus === "BEHANDLES_IKKE" || (saker.length === 1 && saker[0].status === "BEHANDLES_IKKE");

    const showUpload = !enSakIkkeInnsyn && !behandlesIkke;

    const newUploadEnabled = useNewUploadEnabled();
    return (
        <VStack gap="space-8">
            <Heading size="medium" level="2">
                {showUpload ? t("tittel") : t("passivTittel")}
            </Heading>
            {showUpload && <TipsReadMore />}
            <Box
                background="info-soft"
                padding={{ xs: "space-16", sm: "space-24" }}
                borderRadius="12"
                borderWidth="1"
                borderColor="info-subtle"
            >
                <VStack gap="space-40">
                    {showUpload && (
                        <VStack gap={isMobile ? "space-16" : "space-40"}>
                            {newUploadEnabled ? (
                                <OpplastingsboksTus
                                    metadata={metadata}
                                    uploadContextId={id}
                                    description={t("beskrivelse")}
                                />
                            ) : (
                                <NavigationGuardProvider>
                                    <Opplastingsboks metadata={metadata} />
                                </NavigationGuardProvider>
                            )}
                        </VStack>
                    )}
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
