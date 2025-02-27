import React, { useMemo } from "react";
import { Alert } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import { useHentTidligereUtbetalinger } from "../../generated/utbetalinger-controller/utbetalinger-controller";
import { filterResponses } from "../filter/lib/filterResponses";
import { NyeOgTidligereUtbetalingerResponse } from "../../generated/model";
import { useFilter } from "../filter/lib/useFilter";

import { UtbetalingerMonthlyList } from "./UtbetalingerMonthlyList";
import { UtbetalingerLoadingWrapper } from "./UtbetalingerLoadingWrapper";

export const UtbetalingerTidligere = () => {
    const { data, isLoading, isError } = useHentTidligereUtbetalinger();
    const { filters } = useFilter();
    const filtrerteTidligere = useMemo(
        () => filterResponses(data, filters)?.filter((nye) => nye.utbetalingerForManed.length),
        [data, filters]
    );

    const { t } = useTranslation("utbetalinger");

    return (
        <UtbetalingerLoadingWrapper isLoading={isLoading} isError={isError}>
            {filtrerteTidligere?.length ? (
                filtrerteTidligere.map((utbetalingSak: NyeOgTidligereUtbetalingerResponse) => (
                    <UtbetalingerMonthlyList
                        utbetalingSak={utbetalingSak}
                        key={`${utbetalingSak.maned}-${utbetalingSak.ar}`}
                    />
                ))
            ) : (
                <Alert variant="info" inline>
                    {filters ? t("feil.ingen.filter") : t("feil.ingen.default.tidligere")}
                </Alert>
            )}
        </UtbetalingerLoadingWrapper>
    );
};
