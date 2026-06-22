"use client";
import OpplastingsboksTus from "@components/filopplasting/OpplastingsboksTus";
import { Box, Heading, VStack } from "@navikt/ds-react";
import useIsMobile from "@utils/useIsMobile";
import { useTranslations } from "next-intl";
import { Metadata } from "@components/filopplasting/types";
import { useParams } from "next/dist/client/components/navigation";

const metadata = { dokumentKontekst: "ettersendelse", type: "annet", tilleggsinfo: "annet" } satisfies Metadata;

const Ettersendelse = () => {
    const { klageId: klageId } = useParams<{ klageId: string }>();

    const t = useTranslations("KlageEttersendelse");
    const isMobile = useIsMobile();

    return (
        <VStack gap="space-8">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <Box
                background="info-soft"
                padding={{ xs: "space-16", sm: "space-24" }}
                borderRadius="12"
                borderWidth="1"
                borderColor="info-subtle"
            >
                <VStack gap="space-40">
                    <VStack gap={isMobile ? "space-16" : "space-40"}>
                        <OpplastingsboksTus metadata={metadata} uploadContextId={klageId} />
                    </VStack>
                </VStack>
            </Box>
        </VStack>
    );
};

export default Ettersendelse;
