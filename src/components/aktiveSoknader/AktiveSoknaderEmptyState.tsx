import { Alert, BodyShort, Heading } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

const AktiveSoknaderEmptyState = () => {
    const t = useTranslations("AktiveSoknader.EmptyState");
    return (
        <Alert variant="info">
            <Heading level="2" size="medium">
                {t("tittel")}
            </Heading>
            <BodyShort>{t("beskrivelse")}</BodyShort>
        </Alert>
    );
};

export default AktiveSoknaderEmptyState;
