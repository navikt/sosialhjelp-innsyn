import { ExclamationmarkTriangleIcon, InformationSquareIcon } from "@navikt/aksel-icons";
import { Tag } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

export type AlertType = "oppgave" | "vilkaar" | "forlenget_behandlingstid";

type Props = {
    alertType: AlertType;
    deadline?: Date;
};

const AlertTagText = ({ alertType, deadline }: Props) => {
    const t = useTranslations("AlertTexts");
    switch (alertType) {
        case "oppgave":
            return deadline ? t("oppgaveMedFrist", { frist: deadline }) : t("oppgaver");
        case "vilkaar":
            return deadline ? t("vilkarsfrist", { frist: deadline }) : t("vilkar");
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
                alertType === "forlenget_behandlingstid" ? <InformationSquareIcon /> : <ExclamationmarkTriangleIcon />
            }
        >
            <AlertTagText alertType={alertType} deadline={deadline} />
        </Tag>
    );
};

export default AlertTag;
