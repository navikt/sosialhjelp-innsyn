"use client";

import { Box, Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import OpplastingsboksTus from "@components/filopplasting/OpplastingsboksTus";
import { Metadata } from "@components/filopplasting/types";
import { useHentVedleggSuspense } from "@generated/vedlegg-controller/vedlegg-controller";
import { VedleggListeSkeleton } from "@components/filopplasting/VedleggListe";
import { useHentOriginalSoknadSuspense } from "@generated/soknads-status-controller/soknads-status-controller";
import { useHentSaksStatuserSuspense } from "@generated/saks-status-controller/saks-status-controller";
import { SoknadsStatusResponseStatus } from "@generated/model";
import FilopplastingSection from "@components/filopplasting/FilopplastingSection";
import DokumentListe from "@components/filopplasting/DokumentListe";

const metadata = { dokumentKontekst: "ettersendelse", type: "annet", tilleggsinfo: "annet" } satisfies Metadata;

interface Props {
    id: string;
    soknadStatus: SoknadsStatusResponseStatus;
}

const Filopplasting = ({ id, soknadStatus }: Props) => {
    const t = useTranslations("Filopplasting");
    const { data: vedlegg } = useHentVedleggSuspense(id);
    const { data: originalSoknad } = useHentOriginalSoknadSuspense(id);
    const { data: saker } = useHentSaksStatuserSuspense(id);
    const enSakIkkeInnsyn = saker.length === 1 && saker[0].status === "IKKE_INNSYN";
    const behandlesIkke =
        soknadStatus === "BEHANDLES_IKKE" || (saker.length === 1 && saker[0].status === "BEHANDLES_IKKE");

    const showUpload = !enSakIkkeInnsyn && !behandlesIkke;

    if (!showUpload) {
        return (
            <VStack gap="space-8">
                <Heading size="medium" level="2">
                    {t("passivTittel")}
                </Heading>
                <Box
                    background="info-soft"
                    padding={{ xs: "space-16", sm: "space-24" }}
                    borderRadius="12"
                    borderWidth="1"
                    borderColor="info-subtle"
                >
                    <DokumentListe vedlegg={vedlegg} originalSoknad={originalSoknad} />
                </Box>
            </VStack>
        );
    }

    return (
        <FilopplastingSection
            upload={<OpplastingsboksTus metadata={metadata} uploadContextId={id} description={t("beskrivelse")} />}
            vedlegg={vedlegg}
            originalSoknad={originalSoknad}
        />
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
