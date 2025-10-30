"use client";

import React, { useEffect } from "react";
import { logger } from "@navikt/next-logger";
import { BodyShort, Button, Heading, VStack, Link as AkselLink } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { ArrowCirclepathIcon } from "@navikt/aksel-icons";

import { Link } from "@i18n/navigation";

interface Props {
    error: Error & { digest?: string };
    reset: () => void;
}

export const Error = ({ error, reset }: Props) => {
    const t = useTranslations("UtbetalingerPage");
    useEffect(() => {
        logger.error(error);
    }, [error]);

    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1">
                {t("feil.tittel")}
            </Heading>
            <BodyShort>{t("feil.melding")}</BodyShort>
            <AkselLink as={Link} href="/">
                Tilbake til start
            </AkselLink>
            <Button icon={<ArrowCirclepathIcon />} onClick={() => reset()}></Button>
        </VStack>
    );
};

export default Error;
