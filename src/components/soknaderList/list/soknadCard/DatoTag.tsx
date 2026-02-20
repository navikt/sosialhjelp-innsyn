import { ReactNode } from "react";
import { Tag } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useTagSize } from "@components/tags/TagsContextProvider";

interface Props {
    mottattDato?: Date;
    sendtDato?: Date;
}

const DatoTag = ({ mottattDato, sendtDato }: Props): ReactNode => {
    const t = useTranslations("DatoTag");
    const size = useTagSize();
    if (sendtDato) {
        return (
            <Tag variant="neutral-moderate" size={size}>
                {t("sendt", { dato: sendtDato })}
            </Tag>
        );
    }

    if (mottattDato) {
        return (
            <Tag variant="neutral-moderate" size={size}>
                {t("mottatt", { dato: mottattDato })}
            </Tag>
        );
    }

    return null;
};

export default DatoTag;
