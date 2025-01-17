import React from "react";
import { Alert } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import { useFilter } from "../filter/FilterContext";
import Lastestriper from "../../../components/lastestriper/Lasterstriper";
import { UtbetalingerResponseMedId } from "../UtbetalingerPanelBeta";

import { ManedGruppe } from "./ManedGruppe";

const NyeUtbetalinger = ({
    utbetalinger,
    isError,
    isLoading,
}: {
    utbetalinger: UtbetalingerResponseMedId[];
    isLoading: boolean;
    isError: boolean;
}) => {
    const { isUsingFilter } = useFilter();
    const { t } = useTranslation("utbetalinger");

    if (isLoading) return <Lastestriper />;

    if (isError)
        return (
            <Alert variant="error" inline>
                {t("feil.fetch")}
            </Alert>
        );

    if (!utbetalinger.length)
        return (
            <Alert variant="info" inline>
                {isUsingFilter ? t("feil.ingen.filter") : t("feil.ingen.default.nye")}
            </Alert>
        );

    return (
        <>
            {utbetalinger.map((utbetalingSak: UtbetalingerResponseMedId) => (
                <ManedGruppe utbetalingSak={utbetalingSak} key={`${utbetalingSak.maned}-${utbetalingSak.ar}`} />
            ))}
        </>
    );
};
export default NyeUtbetalinger;
