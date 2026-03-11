import { useTranslations } from "next-intl";
import { useTagSize } from "@components/tags/TagsContextProvider";
import { Tag } from "@navikt/ds-react";
import { InformationSquareIcon } from "@navikt/aksel-icons";

const BehandlesIkkeTag = () => {
    const t = useTranslations("BehandlesIkkeTag");
    const size = useTagSize();
    return (
        <Tag variant="warning-moderate" size={size} icon={<InformationSquareIcon aria-hidden />}>
            {t("tittel")}
        </Tag>
    );
};

export default BehandlesIkkeTag;
