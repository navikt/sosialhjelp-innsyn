"use client";

import { Box, Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import useIsMobile from "@utils/useIsMobile";
import DokumentListe, { DokumentListeProps } from "./DokumentListe";
import TipsReadMore from "./TipsReadMore";

interface Props extends DokumentListeProps {
    upload?: ReactNode;
    hideReadMore?: boolean;
}

const FilopplastingSection = ({ upload, hideReadMore, vedlegg, originalSoknad, visType }: Props) => {
    const t = useTranslations("Filopplasting");
    const isMobile = useIsMobile();

    return (
        <VStack gap="space-8">
            <Heading size="medium" level="2">
                {t(hideReadMore ? "passivTittel" : "tittel")}
            </Heading>
            {!hideReadMore && <TipsReadMore />}
            <Box
                background="info-soft"
                padding={{ xs: "space-16", sm: "space-24" }}
                borderRadius="12"
                borderWidth="1"
                borderColor="info-subtle"
            >
                <VStack gap="space-40">
                    <VStack gap={isMobile ? "space-16" : "space-40"}>{upload}</VStack>
                    <DokumentListe vedlegg={vedlegg} originalSoknad={originalSoknad} visType={visType} />
                </VStack>
            </Box>
        </VStack>
    );
};

export default FilopplastingSection;
