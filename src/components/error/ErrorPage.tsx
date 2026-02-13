import React, { ReactNode } from "react";
import { BodyShort, VStack, Button, Heading, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import { Link } from "@i18n/navigation";
import TrengerDuRaskHjelp from "@components/error/TrengerDuRaskHjelp";

const ErrorPage = (): ReactNode => {
    const t = useTranslations("ErrorPage");
    return (
        <VStack gap="space-64" paddingBlock="space-64 space-0">
            <VStack gap="space-24">
                <Heading size="xlarge" level="1">
                    {t("tittel")}
                </Heading>
                <BodyShort>{t("description")}</BodyShort>
                <List>
                    <ListItem>{t("oppdatere")}</ListItem>
                    <ListItem>{t("relogge")}</ListItem>
                    <ListItem>{t("vente")}</ListItem>
                </List>
                <Button
                    as={Link}
                    href="/"
                    variant="secondary"
                    className="self-start"
                    icon={<ArrowLeftIcon aria-hidden />}
                >
                    {t("back")}
                </Button>
            </VStack>
            <TrengerDuRaskHjelp />
        </VStack>
    );
};

export default ErrorPage;
