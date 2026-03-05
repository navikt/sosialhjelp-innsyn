import { BodyLong, Heading, ReadMore } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

const OppgaverReadMore = () => {
    const t = useTranslations("OppgaverReadMore");
    return (
        <ReadMore header={t("header")}>
            <Heading level="3" size="xsmall">
                {t("feilFormatHeading")}
            </Heading>
            <BodyLong spacing>{t("feilFormatBody")}</BodyLong>
            <Heading level="3" size="xsmall">
                {t("papirHeading")}
            </Heading>
            <BodyLong spacing>{t("papirBody")}</BodyLong>
            <Heading level="3" size="xsmall">
                {t("nettsidesHeading")}
            </Heading>
            <BodyLong spacing>{t("nettsidesBody")}</BodyLong>
            <Heading level="3" size="xsmall">
                {t("lesbarHeading")}
            </Heading>
            <BodyLong spacing>{t("lesbarBody")}</BodyLong>
        </ReadMore>
    );
};

export default OppgaverReadMore;
