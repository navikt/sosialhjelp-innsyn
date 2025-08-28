import React, { useMemo } from "react";
import { Alert } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { useFilter } from "../filter/lib/useFilter";
import { useHentNyeUtbetalinger } from "../../generated/utbetalinger-controller/utbetalinger-controller";
import { filterResponses } from "../filter/lib/filterResponses";

import { UtbetalingerLoadingWrapper } from "./UtbetalingerLoadingWrapper";
import { UtbetalingerMonthlyList } from "./UtbetalingerMonthlyList";

const UtbetalingerNye = () => {
    const t = useTranslations("utbetalinger");
    const { data: nye, isLoading, isError } = useHentNyeUtbetalinger();
    const { filters } = useFilter();

    const filtrerteNye = useMemo(
        () => filterResponses(nye, filters)?.filter((nye) => nye.utbetalingerForManed.length),
        [nye, filters]
    );
    return (
        <UtbetalingerLoadingWrapper isLoading={isLoading} isError={isError}>
            {filtrerteNye?.length ? (
                filtrerteNye.map((utbetalingSak) => (
                    <UtbetalingerMonthlyList
                        utbetalingSak={utbetalingSak}
                        key={`${utbetalingSak.maned}-${utbetalingSak.ar}`}
                    />
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
