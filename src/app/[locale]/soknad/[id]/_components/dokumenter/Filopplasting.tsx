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

const metadata = { dokumentKontekst: "ettersendelse", type: "annet", tilleggsinfo: "annet" } satisfies Metadata;

interface Props {
    id: string;
    newUploadEnabled: boolean;
}

const Filopplasting = ({ id, newUploadEnabled }: Props) => {
    const t = useTranslations("Filopplasting");
    const tOpplastingsboks = useTranslations("Opplastingsboks");
    const isMobile = useIsMobile();

    const { data } = useHentVedleggSuspense(id);
    const ettersendelseDokumenter = data.filter(
        (vedlegg) => vedlegg.type === "annet" && vedlegg.tilleggsinfo === "annet"
    );

    return (
        <VStack gap="space-8">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            {!isMobile && <BodyLong>{tOpplastingsboks("beskrivelse")}</BodyLong>}
            <Box.New
                background="info-soft"
                padding="space-24"
                borderRadius="12"
                borderWidth="1"
                borderColor="info-subtle"
            >
                {isMobile && <BodyLong className="mb-4">{tOpplastingsboks("beskrivelse")}</BodyLong>}
                <NavigationGuardProvider>
                    {newUploadEnabled ? (
                        <OpplastingsboksTus metadata={metadata} id={id} />
                    ) : (
                        <Opplastingsboks metadata={metadata} />
                    )}
                </NavigationGuardProvider>
                {ettersendelseDokumenter.length > 0 && (
                    <VStack gap="space-8" className={isMobile ? "mt-10" : "mt-10"}>
                        <Heading size="small" level="3">
                            {t("opplastedeVedlegg")}
                        </Heading>
                        <VedleggListe vedlegg={ettersendelseDokumenter} />
                    </VStack>
                )}
            </Box.New>
        </VStack>
    );
};
export const FilopplastingSkeleton = () => {
    const t = useTranslations("Filopplasting");
    return (
        <VStack gap="space-8">
            <Heading size="small" level="3" spacing>
                {t("tittel")}
            </Heading>
            <VedleggListeSkeleton />
        </VStack>
    );
};

export default Filopplasting;
