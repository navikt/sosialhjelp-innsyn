"use client";

import { Heading, VStack } from "@navikt/ds-react";
import React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useHentVedlegg } from "../../../generated/vedlegg-controller/vedlegg-controller";
import SoknadCardSkeleton from "../../soknaderList/list/soknadCard/SoknadCardSkeleton";

import VedleggListe from "./VedleggListe";

const Dokumenter = () => {
    const t = useTranslations("Dokumenter");
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useHentVedlegg(id);

    if (isLoading) {
        return <SoknadCardSkeleton />;
    }

    if (!data || data.length === 0) {
        return null;
    }
    return (
        <VStack gap="2">
            <Heading size="large" level="2" spacing>
                {t("tittel")}
            </Heading>
            <VedleggListe vedlegg={data} />
        </VStack>
    );
};

export default Dokumenter;
