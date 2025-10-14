"use client";

import { FileUpload, Heading, HStack, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useParams } from "next/navigation";

import { useHentOriginalSoknadSuspense } from "@generated/soknads-status-controller/soknads-status-controller";

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
                    <Heading size="large" level="2" spacing>
                        {t("tittel")}
                    </Heading>
                    <FileUpload.Item
                        as="li"
                        href={originalSoknad.url}
                        description={
                            originalSoknad.date
                                ? `${t("sendt", {
                                      dato: new Date(originalSoknad.date),
                                  })}`
                                : undefined
                        }
                        file={{
                            name: originalSoknad.filename?.length ? originalSoknad.filename : t("soknadFilename"),
                            size: originalSoknad.size,
                        }}
                        className="w-full"
                    />
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
