import { ReadMore } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

const SoknadsoppgaverReadMore = () => {
    const t = useTranslations("SoknadsoppgaverReadMore");
    return <ReadMore header={t("title")}>{t("description")}</ReadMore>;
};

export default SoknadsoppgaverReadMore;
