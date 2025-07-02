"use client";

import { Stepper } from "@navikt/ds-react/Stepper";
import { Alert, Heading, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React from "react";

import useSteps from "./useSteps";
import Step from "./steps/Step";

const Oversikt = () => {
    const t = useTranslations("Oversikt");
    const { isLoading, steps, error, completed } = useSteps();
    if (isLoading) {
        return (
            <VStack gap="2">
                <Heading size="large" level="2">
                    {t("tittel")}
                </Heading>
                <OversiktSkeleton />
            </VStack>
        );
    }
    // TODO: Gudane veit hva man skal gjøre her
    if (error) {
        return (
            <VStack gap="2">
                <Heading size="large" level="2">
                    {t("tittel")}
                </Heading>
                <Alert variant="error">Noe gikk galt under henting av oversikt. Vennligst prøv igjen senere.</Alert>
            </VStack>
        );
    }
    return (
        <VStack gap="2">
            <Heading size="large" level="2">
                {t("tittel")}
            </Heading>
            <Stepper activeStep={completed ?? 0}>{steps}</Stepper>
        </VStack>
    );
};

const OversiktSkeleton = () => (
    <Stepper activeStep={2}>
        <Step completed interactive={false} heading={<Skeleton width="400px" />}>
            <Skeleton width="200px" />
            <Skeleton width="150px" />
        </Step>
        <Step interactive={false} heading={<Skeleton width="400px" />}>
            <Skeleton width="200px" />
        </Step>
    </Stepper>
);

export default Oversikt;
