"use client";

import { Alert, Heading, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { useHentForelopigSvarStatusSuspense } from "@generated/forelopig-svar-controller/forelopig-svar-controller";

export const ForelopigSvarAlertSkeleton = () => {
    return (
        <VStack gap="2">
            <Skeleton variant="rounded" width="100%" height={40} />
        </VStack>
    );
};

export const ForelopigSvarAlert = () => {
    const t = useTranslations("StatusForelopigSvar");
    const { id } = useParams<{ id: string }>();
    const { data } = useHentForelopigSvarStatusSuspense(id);

    if (data === null) {
        return null;
    }

    return (
        <Alert variant="warning">
            <Heading size="small" level="2">
                {t("tittel")}
            </Heading>
            {t("beskrivelse")}
        </Alert>
    );
};
