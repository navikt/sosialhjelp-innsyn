import { ExclamationmarkTriangleIcon, InformationSquareIcon } from "@navikt/aksel-icons";
import { Tag } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

export type AlertType = "oppgave" | "forlenget_behandlingstid";

type Props = {
    alertType: AlertType;
    deadline?: Date;
};

const AlertTagText = ({ alertType, deadline }: Props) => {
    const t = useTranslations("AlertTexts");
    switch (alertType) {
        case "oppgave":
            return deadline ? t("oppgaveMedFrist", { frist: deadline }) : t("oppgaver");
        case "forlenget_behandlingstid":
            return t("forlengetSaksbehandlingsTid");
    }
};

const AlertTag = ({ alertType, deadline }: Props) => {
    return (
        <Tag
            variant="warning-moderate"
            size="small"
            icon={
                alertType === "forlenget_behandlingstid" ? (
                    <InformationSquareIcon aria-hidden="true" />
                ) : (
                    <ExclamationmarkTriangleIcon aria-hidden="true" />
                )
            }
        >
            <AlertTagText alertType={alertType} deadline={deadline} />
        </Tag>
    );
};

export default AlertTag;
