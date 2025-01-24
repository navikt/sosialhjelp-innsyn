import { useTranslation } from "next-i18next";
import { Alert, BodyShort, Heading } from "@navikt/ds-react";

import useIsAalesundBlocked from "../../hooks/useIsAalesundBlocked";

/**
 * Lagringstid er 15 måneder, så vennligst slett meg 1. april 2025.
 */
export const DriftsmeldingAalesund = () => {
    const { t } = useTranslation("aalesund");
    return !useIsAalesundBlocked() ? null : (
        <Alert variant="warning">
            <Heading size="small" level="2" spacing>
                {t("title")}
            </Heading>
            <BodyShort spacing>{t("message")}</BodyShort>
        </Alert>
    );
};
