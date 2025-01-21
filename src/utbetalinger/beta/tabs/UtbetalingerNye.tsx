import React from "react";
import { Alert } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import { useFilter } from "../filter/FilterContext";
import { NyeOgTidligereUtbetalingerResponse } from "../../../generated/model";

import { ManedGruppe } from "./ManedGruppe";
import { UtbetalingerLoadingWrapper } from "./UtbetalingerLoadingWrapper";

const UtbetalingerNye = ({
    utbetalinger,
    isError,
    isLoading,
}: {
    utbetalinger: NyeOgTidligereUtbetalingerResponse[] | undefined;
    isLoading: boolean;
    isError: boolean;
}) => {
    const { filters } = useFilter();
    const { t } = useTranslation("utbetalinger");

    return (
        <UtbetalingerLoadingWrapper isLoading={isLoading} isError={isError}>
            {utbetalinger?.length ? (
                utbetalinger.map((utbetalingSak) => (
                    <ManedGruppe utbetalingSak={utbetalingSak} key={`${utbetalingSak.maned}-${utbetalingSak.ar}`} />
                ))
            ) : (
                <Alert variant="info" inline>
                    {filters ? t("feil.ingen.filter") : t("feil.ingen.default.nye")}
                </Alert>
            )}
        </UtbetalingerLoadingWrapper>
    );
};
export default UtbetalingerNye;
