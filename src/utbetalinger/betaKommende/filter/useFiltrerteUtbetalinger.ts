import React from "react";
import {useFilter} from "./FilterContext";
import {KommendeOgUtbetalteUtbetalingerResponse} from "../../../generated/model";

const useFiltrerteUtbetalinger = (utbetalinger: KommendeOgUtbetalteUtbetalingerResponse[]) => {
    const {filter} = useFilter();

    const filtrerteUtbetalte = React.useMemo(() => {
        return utbetalinger.filter((response) => {
            const utbetalinger = response.utbetalinger.filter((utbetaling) => {
                let matchMottaker;
                if (filter.mottaker.length === 0 || filter.mottaker.length === 2) {
                    matchMottaker = true;
                } else if (filter.mottaker.includes("annenMottaker")) {
                    matchMottaker = utbetaling.annenMottaker;
                } else {
                    matchMottaker = !utbetaling.annenMottaker;
                }

                let matchPeriode;
                if (!utbetaling.utbetalingsdato) {
                    matchPeriode = false;
                } else {
                    matchPeriode = true;
                }

                return matchMottaker && matchPeriode;
            });
            return utbetalinger.length > 0;
        });
    }, [utbetalinger, filter]);

    return filtrerteUtbetalte;
};

export default useFiltrerteUtbetalinger;
