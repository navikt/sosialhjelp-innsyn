import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import { Tag } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useTagSize } from "@components/tags/TagsContextProvider";

const VedtakTag = () => {
    const t = useTranslations("VedtakTag");
    const size = useTagSize();
    return (
        <Tag
            variant="warning-moderate"
            size={size}
            icon={<ExclamationmarkTriangleIcon title={t("varselTrekantAltText")} />}
        >
            {t("tittel")}
        </Tag>
    );
};

export default VedtakTag;
