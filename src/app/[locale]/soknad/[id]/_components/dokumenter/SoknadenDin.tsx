"use client";

import { BodyShort, Heading, HStack, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useParams } from "next/navigation";
import { FileIcon } from "@navikt/aksel-icons";

import { useHentOriginalSoknadSuspense } from "@generated/soknads-status-controller/soknads-status-controller";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const SoknadenDin = () => {
    const t = useTranslations("SoknadenDin");
    const { id } = useParams<{ id: string }>();
    const { data: originalSoknad } = useHentOriginalSoknadSuspense(id);
    if (!originalSoknad) {
        return null;
    }
    return (
        <VStack gap="2">
            {originalSoknad && (
                <>
                    <Heading size="medium" level="2" spacing>
                        {t("tittel")}
                    </Heading>
                    <DigisosLinkCard
                        href={originalSoknad.url}
                        icon={<FileIcon />}
                        underline={true}
                        cardIcon="expand"
                        description={
                            <>
                                <HStack gap="1">
                                    <BodyShort>{originalSoknad.size},</BodyShort>
                                    <BodyShort>
                                        {originalSoknad.date
                                            ? `${t("sendt", {
                                                  dato: new Date(originalSoknad.date),
                                              })}`
                                            : undefined}
                                    </BodyShort>
                                </HStack>
                            </>
                        }
                    >
                        {originalSoknad.filename?.length ? originalSoknad.filename : t("soknadFilename")}
                    </DigisosLinkCard>
                </>
            )}
        </VStack>
    );
};

export const SoknadenDinSkeleton = () => (
    <VStack as="ul" gap="2" className="navds-file-item__inner">
        <HStack as="li" align="center" gap="2">
            <Skeleton variant="circle" height="48px" width="48px" />
            <VStack justify="center" gap="2">
                <Skeleton variant="rectangle" width="200px" />
                <Skeleton variant="rectangle" width="50px" />
            </VStack>
        </HStack>
    </VStack>
);

export default SoknadenDin;
