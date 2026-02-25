import { BodyLong, ReadMore } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

const OppgaverReadMore = () => {
    const t = useTranslations("OppgaverReadMore");
    return (
        <ReadMore header={t("header")}>
            <BodyLong weight="semibold">{t("feilFormatHeading")}</BodyLong>
            <BodyLong spacing>{t("feilFormatBody")}</BodyLong>
            <BodyLong weight="semibold">{t("papirHeading")}</BodyLong>
            <BodyLong spacing>{t("papirBody")}</BodyLong>
            <BodyLong weight="semibold">{t("nettsidesHeading")}</BodyLong>
            <BodyLong spacing>{t("nettsidesBody")}</BodyLong>
            <BodyLong weight="semibold">{t("lesbarHeading")}</BodyLong>
            <BodyLong spacing>{t("lesbarBody")}</BodyLong>
        </ReadMore>
    );
};

export default OppgaverReadMore;
