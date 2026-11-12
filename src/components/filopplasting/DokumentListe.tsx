"use client";

import { Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { OriginalSoknadDto, VedleggResponse } from "@generated/model";
import VedleggListe from "./VedleggListe";

export interface DokumentListeProps {
    vedlegg: VedleggResponse[];
    originalSoknad?: OriginalSoknadDto;
    visType?: boolean;
}

const DokumentListe = ({ vedlegg, originalSoknad, visType }: DokumentListeProps) => {
    const t = useTranslations("DokumentListe");

    if (vedlegg.length === 0 && !originalSoknad) return null;

    return (
        <VStack gap="space-8">
            <Heading size="small" level="3" id="dokumenter">
                {t("tittel")}
            </Heading>
            <VedleggListe
                vedlegg={vedlegg}
                originalSoknad={originalSoknad}
                labelledById="dokumenter"
                visType={visType}
            />
        </VStack>
    );
};

export default DokumentListe;
