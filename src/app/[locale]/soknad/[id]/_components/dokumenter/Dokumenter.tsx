"use client";

import { Heading, VStack } from "@navikt/ds-react";
import React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useHentVedleggSuspense } from "@generated/vedlegg-controller/vedlegg-controller";

import VedleggListe, { VedleggListeSkeleton } from "./VedleggListe";

const Dokumenter = () => {
    const t = useTranslations("Dokumenter");
    const { id } = useParams<{ id: string }>();
    const { data } = useHentVedleggSuspense(id);

    return (
        <VStack gap="2">
            <Heading size="large" level="2" spacing>
                {t("tittel")}
            </Heading>
            <VedleggListe vedlegg={data} />
        </VStack>
    );
};

export const DokumenterSkeleton = () => {
    const t = useTranslations("Dokumenter");
    return (
        <VStack gap="2">
            <Heading size="large" level="2" spacing>
                {t("tittel")}
            </Heading>
            <VedleggListeSkeleton />
        </VStack>
    );
};

export default Dokumenter;
