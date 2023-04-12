import React from "react";
import {useFilter} from "./FilterContext";
import {KommendeOgUtbetalteUtbetalingerResponse} from "../../../generated/model";
import {isAfter, isBefore} from "date-fns";

const stringToDateWithoutTimezone = (datoString: string) => {
    const dateWithTimesone = new Date(datoString);
    return new Date(dateWithTimesone.toISOString().slice(0, -1));
};
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

                // Hvis vi ikke har dato-filter eller utbetalingsdato, trenger vi ikke sjekke datofilteret.
                if (!utbetaling.utbetalingsdato || (!filter.tilDato && !filter.fraDato)) return matchMottaker;

                const utbetalingsDato = stringToDateWithoutTimezone(utbetaling.utbetalingsdato);
                let matchFra = filter.fraDato ? isAfter(utbetalingsDato, filter.fraDato) : true;
                let matchTil = filter.tilDato ? isBefore(utbetalingsDato, filter.tilDato) : true;

                return matchMottaker && matchTil && matchFra;
            });
            return utbetalinger.length > 0;
        });
    }, [utbetalinger, filter]);

    return filtrerteUtbetalte;
};

export default useFiltrerteUtbetalinger;
