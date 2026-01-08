import { ReactNode } from "react";
import { Tag } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

interface Props {
    mottattDato?: Date;
    sendtDato?: Date;
}

const DatoTag = ({ mottattDato, sendtDato }: Props): ReactNode => {
    const t = useTranslations("DatoTag");
    if (sendtDato) {
        return (
            <Tag variant="neutral-moderate" size="small">
                {t("sendt", { dato: sendtDato })}
            </Tag>
        );
    }

    if (mottattDato) {
        return (
            <Tag variant="neutral-moderate" size="small">
                {t("mottatt", { dato: mottattDato })}
            </Tag>
        );
    }

    return null;
};

export default DatoTag;
