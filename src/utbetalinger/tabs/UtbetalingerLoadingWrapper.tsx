import React from "react";
import { useTranslation } from "next-i18next";
import { Alert } from "@navikt/ds-react";

import Lastestriper from "../../components/lastestriper/Lasterstriper";

export const UtbetalingerLoadingWrapper = ({
    isLoading,
    isError,
    children,
}: {
    isLoading: boolean;
    isError: boolean;
    children: React.ReactNode;
}) => {
    const { t } = useTranslation("utbetalinger");

    if (isLoading) return <Lastestriper />;
    if (isError)
        return (
            <Alert variant="error" inline>
                {t("feil.fetch")}
            </Alert>
        );

    return children;
};
