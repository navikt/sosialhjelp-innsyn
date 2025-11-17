"use client";

import React, { useEffect } from "react";
import { logger } from "@navikt/next-logger";
import { BodyShort, Box, Button, Heading, List } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { ListItem } from "@navikt/ds-react/List";
import { ArrowLeftIcon } from "@navikt/aksel-icons";

import TrengerDuRaskHjelp from "@components/error/TrengerDuRaskHjelp";
import { Link } from "@i18n/navigation";

interface Props {
    error: Error & { digest?: string };
}

export const Error = ({ error }: Props) => {
    const t = useTranslations("ErrorPage");
    useEffect(() => {
        logger.error(error);
    }, [error]);

    return (
        <>
            <Box.New className="my-20">
                <Heading size="xlarge" level="1" className="mb-4">
                    {t("tittel")}
                </Heading>
                <BodyShort className="mb-8">{t("description")}</BodyShort>
                <List className="mb-8">
                    <ListItem>{t("oppdatere")}</ListItem>
                    <ListItem>{t("relogge")}</ListItem>
                    <ListItem>{t("vente")}</ListItem>
                </List>
                <Button as={Link} href="/" variant="secondary" className="self-start" icon={<ArrowLeftIcon />}>
                    {t("back")}
                </Button>
            </Box.New>
            <TrengerDuRaskHjelp />
        </>
    );
};

export default Error;
