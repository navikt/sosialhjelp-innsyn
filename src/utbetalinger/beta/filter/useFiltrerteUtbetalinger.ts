import React from "react";
import { isAfter, isBefore } from "date-fns";

import { ManedUtbetaling, NyeOgTidligereUtbetalingerResponse } from "../../../generated/model";

import { FilterPredicate, useFilter } from "./FilterContext";

const stringToDateWithoutTimezone = (datoString: string) => new Date(new Date(datoString).toISOString().slice(0, -1));

export const filterMatch = (
    { annenMottaker, forfallsdato, utbetalingsdato }: ManedUtbetaling,
    filters: FilterPredicate | null
) => {
    if (!filters) return true;
    const { fraDato, tilDato, mottaker } = filters;
    let matchMottaker;
    if (!mottaker) matchMottaker = true;
    else if (mottaker === "annenMottaker") matchMottaker = annenMottaker;
    else matchMottaker = !annenMottaker;

    // Hvis vi ikke har dato-filter eller utbetalingsdato/forfallsdato, trenger vi ikke sjekke datofilteret.
    if ((!utbetalingsdato && !forfallsdato) || (!tilDato && !fraDato)) return matchMottaker;

    const dato = stringToDateWithoutTimezone(utbetalingsdato ?? forfallsdato!);
    const matchFra = !fraDato ? true : !isBefore(dato, fraDato);
    const matchTil = !tilDato ? true : !isAfter(dato, tilDato);

    return matchMottaker && matchTil && matchFra;
};

const useFiltrerteUtbetalinger = (utbetalinger: NyeOgTidligereUtbetalingerResponse[] | undefined) => {
    const { filters } = useFilter();

    return React.useMemo(
        () =>
            utbetalinger
                ?.map((response) => ({
                    ...response,
                    utbetalingerForManed: response.utbetalingerForManed.filter((utbetaling) =>
                        filterMatch(utbetaling, filters)
                    ),
                }))
                .filter((response) => response.utbetalingerForManed.length > 0),
        [utbetalinger, filters]
    );
};

export default useFiltrerteUtbetalinger;
