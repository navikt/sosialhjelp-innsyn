import { PersonGavelIcon } from "@navikt/aksel-icons";
import { Tag } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useTagSize } from "@components/tags/TagsContextProvider";

const KlageTag = () => {
    const t = useTranslations("KlageTag");
    const size = useTagSize();
    return (
        <Tag variant="info-moderate" size={size} icon={<PersonGavelIcon aria-hidden />}>
            {t("tittel")}
        </Tag>
    );
};

export default KlageTag;
