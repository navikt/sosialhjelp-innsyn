import React from "react";
import { useTranslations } from "next-intl";
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
    const t = useTranslations("utbetalinger");

    if (isLoading) return <Lastestriper />;
    if (isError)
        return (
            <Alert variant="error" inline>
                {t("feil.fetch")}
            </Alert>
        );

    return children;
};
