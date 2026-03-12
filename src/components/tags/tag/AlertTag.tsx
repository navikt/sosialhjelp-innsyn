import { ExclamationmarkTriangleIcon, InformationSquareIcon } from "@navikt/aksel-icons";
import { Tag } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useTagSize } from "@components/tags/TagsContextProvider";

export type AlertType = "oppgave" | "vilkar" | "forlenget_behandlingstid";

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
        case "vilkar":
            return deadline ? t("vilkarsfrist", { frist: deadline }) : t("vilkar");
    }
};

const AlertTag = ({ alertType, deadline }: Props) => {
    const t = useTranslations("AlertTexts");
    const size = useTagSize();
    return (
        <Tag
            variant="warning-moderate"
            size={size}
            icon={
                alertType === "forlenget_behandlingstid" ? (
                    <InformationSquareIcon aria-hidden="true" />
                ) : (
                    <ExclamationmarkTriangleIcon title={t("varselTrekantAltText")} />
                )
            }
        >
            <AlertTagText alertType={alertType} deadline={deadline} />
        </Tag>
    );
};

export default AlertTag;
