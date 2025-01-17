import React from "react";
import { Alert } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import { useHentTidligereUtbetalinger } from "../../../generated/utbetalinger-controller/utbetalinger-controller";
import useFiltrerteUtbetalinger from "../filter/useFiltrerteUtbetalinger";
import { useFilter } from "../filter/FilterContext";
import Lastestriper from "../../../components/lastestriper/Lasterstriper";
import { UtbetalingerResponseMedId } from "../UtbetalingerPanelBeta";
import { addIdToUtbetalinger } from "../addIdToUtbetalinger";

import { ManedGruppe } from "./ManedGruppe";

export const TidligereUtbetalinger = () => {
    const { data, isLoading, isError } = useHentTidligereUtbetalinger({ query: { select: addIdToUtbetalinger } });
    const filtrerteTidligere = useFiltrerteUtbetalinger(data ?? []);
    const { isUsingFilter } = useFilter();
    const { t } = useTranslation("utbetalinger");

    if (isLoading) {
        return <Lastestriper />;
    }
    if (isError) {
        return (
            <Alert variant="error" inline>
                {t("feil.fetch")}
            </Alert>
        );
    }
    if (filtrerteTidligere.length === 0)
        return (
            <Alert variant="info" inline>
                {isUsingFilter ? t("feil.ingen.filter") : t("feil.ingen.default.tidligere")}
            </Alert>
        );

    return (
        <>
            {filtrerteTidligere.map((utbetalingSak: UtbetalingerResponseMedId) => (
                <ManedGruppe utbetalingSak={utbetalingSak} key={`${utbetalingSak.maned}-${utbetalingSak.ar}`} />
            ))}
        </>
    );
};
