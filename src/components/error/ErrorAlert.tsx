import React from "react";
import { BodyShort, Heading, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { useTranslations } from "next-intl";

import AlertWithCloseButton from "@components/alert/AlertWithCloseButton";

const ErrorAlert = (): React.JSX.Element => {
    const t = useTranslations("ErrorAlert");
    return (
        <AlertWithCloseButton variant="warning">
            <Heading size="small" level="2" spacing>
                {t("tittel")}
            </Heading>
            <BodyShort spacing>{t("description")}</BodyShort>
            <List>
                <ListItem>{t("oppdatere")}</ListItem>
                <ListItem>{t("relogge")}</ListItem>
                <ListItem>{t("vente")}</ListItem>
            </List>
        </AlertWithCloseButton>
    );
};

export default ErrorAlert;
