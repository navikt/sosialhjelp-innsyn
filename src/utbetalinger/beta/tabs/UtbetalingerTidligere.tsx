import React from "react";
import { Alert } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import { useHentTidligereUtbetalinger } from "../../../generated/utbetalinger-controller/utbetalinger-controller";
import useFiltrerteUtbetalinger from "../filter/useFiltrerteUtbetalinger";
import { useFilter } from "../filter/FilterContext";
import { UtbetalingerResponseMedId } from "../UtbetalingerPanelBeta";
import { addIdToUtbetalinger } from "../addIdToUtbetalinger";

import { ManedGruppe } from "./ManedGruppe";
import { UtbetalingerLoadingWrapper } from "./UtbetalingerLoadingWrapper";

export const UtbetalingerTidligere = () => {
    const { data, isLoading, isError } = useHentTidligereUtbetalinger({ query: { select: addIdToUtbetalinger } });
    const filtrerteTidligere = useFiltrerteUtbetalinger(data ?? []);
    const { isUsingFilter } = useFilter();
    const { t } = useTranslation("utbetalinger");

    return (
        <UtbetalingerLoadingWrapper isLoading={isLoading} isError={isError}>
            {filtrerteTidligere?.length ? (
                filtrerteTidligere.map((utbetalingSak: UtbetalingerResponseMedId) => (
                    <ManedGruppe utbetalingSak={utbetalingSak} key={`${utbetalingSak.maned}-${utbetalingSak.ar}`} />
                ))
            ) : (
                <Alert variant="info" inline>
                    {isUsingFilter ? t("feil.ingen.filter") : t("feil.ingen.default.tidligere")}
                </Alert>
            )}
        </UtbetalingerLoadingWrapper>
    );
};
