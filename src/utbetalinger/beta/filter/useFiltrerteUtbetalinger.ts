import React from "react";
import {FilterKey, MottakerFilter, useFilter} from "./FilterContext";
import {ManedUtbetaling} from "../../../generated/model";
import {isAfter, isBefore, isEqual} from "date-fns";
import {UtbetalingerResponseMedId} from "../UtbetalingerPanelBeta";

const stringToDateWithoutTimezone = (datoString: string) => {
    const dateWithTimesone = new Date(datoString);
    return new Date(dateWithTimesone.toISOString().slice(0, -1));
};

export const filterMatch = (utbetaling: ManedUtbetaling, filter: FilterKey) => {
    let matchMottaker;
    if (filter.mottaker === MottakerFilter.Alle) {
        matchMottaker = true;
    } else if (filter.mottaker === MottakerFilter.AnnenMottaker) {
        matchMottaker = utbetaling.annenMottaker;
    } else {
        matchMottaker = !utbetaling.annenMottaker;
    }

    // Hvis vi ikke har dato-filter eller utbetalingsdato/forfallsdato, trenger vi ikke sjekke datofilteret.
    if ((!utbetaling.utbetalingsdato && !utbetaling.forfallsdato) || (!filter.tilDato && !filter.fraDato))
        return matchMottaker;

    const dato = stringToDateWithoutTimezone(utbetaling.utbetalingsdato ?? utbetaling.forfallsdato!);
    let matchFra = filter.fraDato ? isAfter(dato, filter.fraDato) || isEqual(dato, filter.fraDato) : true;
    let matchTil = filter.tilDato ? isBefore(dato, filter.tilDato) || isEqual(dato, filter.tilDato) : true;

    return matchMottaker && matchTil && matchFra;
};
const useFiltrerteUtbetalinger = (utbetalinger: UtbetalingerResponseMedId[]) => {
    const {filter} = useFilter();

    const filtrerteUtbetalte = React.useMemo(() => {
        return utbetalinger
            .map((response) => {
                const filtrertPerManed = response.utbetalingerForManed.filter((utbetaling) => {
                    return filterMatch(utbetaling, filter);
                });
                return {...response, utbetalingerForManed: filtrertPerManed};
            })
            .filter((response) => response.utbetalingerForManed.length > 0);
    }, [utbetalinger, filter]);

    return filtrerteUtbetalte;
};

export default useFiltrerteUtbetalinger;
