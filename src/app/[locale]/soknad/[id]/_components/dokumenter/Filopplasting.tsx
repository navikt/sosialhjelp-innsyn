"use client";

import { Heading, VStack, Box } from "@navikt/ds-react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { useTranslations } from "next-intl";
import OpplastingsboksTus from "@components/filopplasting/new/OpplastingsboksTus";
import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";
import { Metadata } from "@components/filopplasting/new/types";
import { useHentVedleggSuspense } from "@generated/vedlegg-controller/vedlegg-controller";

import VedleggListe, { VedleggListeSkeleton } from "./VedleggListe";

const metadata = { dokumentKontekst: "ettersendelse", type: "annet", tilleggsinfo: "annet" } satisfies Metadata;

interface Props {
    id: string;
    newUploadEnabled: boolean;
}

const Filopplasting = ({ id, newUploadEnabled }: Props) => {
    const t = useTranslations("Filopplasting");

    const { data } = useHentVedleggSuspense(id);
    const ettersendelseDokumenter = data.filter(
        (vedlegg) => vedlegg.type === "annet" && vedlegg.tilleggsinfo === "annet"
    );

    return (
        <VStack gap="2">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <Box.New
                background="info-soft"
                padding="space-24"
                borderRadius="xlarge"
                borderWidth="1"
                borderColor="info-subtle"
            >
                <NavigationGuardProvider>
                    {newUploadEnabled ? (
                        <OpplastingsboksTus metadata={metadata} id={id} />
                    ) : (
                        <Opplastingsboks metadata={metadata} />
                    )}
                </NavigationGuardProvider>
                {ettersendelseDokumenter.length > 0 && (
                    <VStack gap="2" className="mt-4">
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
        <VStack gap="2">
            <Heading size="small" level="3" spacing>
                {t("tittel")}
            </Heading>
            <VedleggListeSkeleton />
        </VStack>
    );
};

export default Filopplasting;
