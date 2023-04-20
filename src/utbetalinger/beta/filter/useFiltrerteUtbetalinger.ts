import React from "react";
import {MottakerFilter, useFilter} from "./FilterContext";
import {NyeOgTidligereUtbetalingerResponse} from "../../../generated/model";
import {isAfter, isBefore} from "date-fns";

const stringToDateWithoutTimezone = (datoString: string) => {
    const dateWithTimesone = new Date(datoString);
    return new Date(dateWithTimesone.toISOString().slice(0, -1));
};
const useFiltrerteUtbetalinger = (utbetalinger: NyeOgTidligereUtbetalingerResponse[]) => {
    const {filter} = useFilter();

    const filtrerteUtbetalte = React.useMemo(() => {
        return utbetalinger
            .map((response) => {
                const filtrertPerManed = response.utbetalingerForManed.filter((utbetaling) => {
                    let matchMottaker;
                    if (filter.mottaker === MottakerFilter.Alle) {
                        matchMottaker = true;
                    } else if (filter.mottaker === MottakerFilter.AnnenMottaker) {
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
                return {...response, utbetalingerForManed: filtrertPerManed};
            })
            .filter((response) => response.utbetalingerForManed.length > 0);
    }, [utbetalinger, filter]);

    return filtrerteUtbetalte;
};

export default useFiltrerteUtbetalinger;
