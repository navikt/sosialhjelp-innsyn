"use client";

import React, { useEffect } from "react";
import { logger } from "@navikt/next-logger";
import { Button, Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import TrengerDuRaskHjelp from "@components/error/TrengerDuRaskHjelp";
import ErrorAlert from "@components/error/ErrorAlert";

interface Props {
    error: Error & { digest?: string };
    reset: () => void;
}

export const Error = ({ error, reset }: Props) => {
    const t = useTranslations("UtbetalingerError");
    useEffect(() => {
        logger.error(error);
    }, [error]);

    return (
        <VStack gap="16" className="mt-20">
            <Heading size="xlarge" level="1">
                {t("tittel")}
            </Heading>
            <ErrorAlert />
            <Button variant="secondary" onClick={() => reset()} className="self-start">
                {t("retry")}
            </Button>
            <TrengerDuRaskHjelp />
        </VStack>
    );
};

export default Error;
