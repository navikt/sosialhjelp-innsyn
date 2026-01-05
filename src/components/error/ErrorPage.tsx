import React, { ReactNode } from "react";
import { BodyShort, Box, Button, Heading, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import { Link } from "@i18n/navigation";
import TrengerDuRaskHjelp from "@components/error/TrengerDuRaskHjelp";

const ErrorPage = (): ReactNode => {
    const t = useTranslations("ErrorPage");
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

export default ErrorPage;
