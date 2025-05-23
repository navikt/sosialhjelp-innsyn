import React, { useEffect, useMemo, useState } from "react";
import { Alert } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { useFilter } from "../filter/lib/useFilter";
import { useHentNyeUtbetalinger } from "../../generated/utbetalinger-controller/utbetalinger-controller";
import { logAmplitudeEvent } from "../../utils/amplitude";
import { filterResponses } from "../filter/lib/filterResponses";

import { UtbetalingerLoadingWrapper } from "./UtbetalingerLoadingWrapper";
import { UtbetalingerMonthlyList } from "./UtbetalingerMonthlyList";

const UtbetalingerNye = () => {
    const [nyeLogged, setNyeLogged] = useState(false);

    const t = useTranslations("utbetalinger");
    const { data: nye, isLoading, isError } = useHentNyeUtbetalinger();
    const { filters } = useFilter();

    useEffect(() => {
        logAmplitudeEvent("Lastet utbetalinger", {
            antall: nye?.[0]?.utbetalingerForManed.length ? nye?.[0].utbetalingerForManed.length : 0,
        });

        if (nyeLogged && !nye?.length) return;
        const sisteManedgruppe = nye?.at(-1)?.utbetalingerForManed;
        const sisteDatoVist = sisteManedgruppe?.at(-1)?.utbetalingsdato ?? sisteManedgruppe?.at(-1)?.forfallsdato;

        logAmplitudeEvent("Hentet nye utbetalinger", { sisteDatoVist });
        setNyeLogged(true);
    }, [nye, nyeLogged]);

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
