import { Tag } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

const VedtakTag = () => {
    const t = useTranslations("VedtakTag");

    return (
        <Tag variant="warning-moderate" size="small">
            {t("tittel")}
        </Tag>
    );
};

export default VedtakTag;
