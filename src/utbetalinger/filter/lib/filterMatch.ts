import { isAfter, isBefore } from "date-fns";

import { ManedUtbetaling } from "../../../generated/model";

import { FilterPredicate } from "./FilterContext";

const stringToDateWithoutTimezone = (datoString: string | undefined) =>
    !datoString ? undefined : new Date(new Date(datoString).toISOString().slice(0, -1));

export const filterMatch = (
    {
        annenMottaker,
        forfallsdato,
        utbetalingsdato,
    }: Pick<ManedUtbetaling, "annenMottaker" | "forfallsdato" | "utbetalingsdato">,
    filters: FilterPredicate
) => {
    const matchMottaker = !filters.mottaker
        ? true
        : (filters.mottaker === "annenMottaker" && annenMottaker) ||
          (filters.mottaker === "minKonto" && !annenMottaker);

    const utbetalingDate = stringToDateWithoutTimezone(utbetalingsdato ?? forfallsdato);

    if (!utbetalingDate) return matchMottaker;

    const matchFra = !filters.fraDato ? true : !isBefore(utbetalingDate, filters.fraDato);
    const matchTil = !filters.tilDato ? true : !isAfter(utbetalingDate, filters.tilDato);

    return matchMottaker && matchTil && matchFra;
};
