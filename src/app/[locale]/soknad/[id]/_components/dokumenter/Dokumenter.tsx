"use client";

import { Heading, VStack } from "@navikt/ds-react";
import React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useHentVedleggSuspense } from "@generated/vedlegg-controller/vedlegg-controller";
import { useHentOriginalSoknadSuspense } from "@generated/soknads-status-controller/soknads-status-controller";

import VedleggListe, { VedleggListeSkeleton } from "./VedleggListe";

const Dokumenter = () => {
    const t = useTranslations("Dokumenter");
    const { id } = useParams<{ id: string }>();
    const { data } = useHentVedleggSuspense(id);
    const { data: originalSoknad } = useHentOriginalSoknadSuspense(id);
    if (data.length === 0 && !originalSoknad) {
        return null;
    }

    return (
        <VStack gap="2">
            <Heading size="large" level="2" spacing>
                {t("tittel")}
            </Heading>
            <VedleggListe vedlegg={data} originalSoknad={originalSoknad} />
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
