import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import { Tag } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

export type AlertType = "oppgave" | "vilkaar" | "forlenget_behandlingstid";

type Props = {
    alertType: AlertType;
    deadline?: Date;
};

const AlertTag = ({ alertType, deadline }: Props) => {
    const t = useTranslations("AlertTexts");

    const getAlertText = (): string => {
        switch (alertType) {
            case "oppgave":
                return deadline ? t("oppgaveMedFrist", { frist: deadline }) : t("oppgaver");
            case "vilkaar":
                return deadline ? t("vilkarsfrist", { frist: deadline }) : t("vilkar");
            case "forlenget_behandlingstid":
                return t("forlengetSaksbehandlingsTid");
            default:
                return "";
        }
    };

    const alertText = getAlertText();

    if (!alertText) {
        return null;
    }

    return (
        <Tag variant="warning-moderate" size="small" icon={<ExclamationmarkTriangleIcon />}>
            {alertText}
        </Tag>
    );
};

export default AlertTag;
