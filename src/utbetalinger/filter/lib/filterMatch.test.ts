import { expect, describe, it } from "vitest";

import { FilterCriteria } from "./FilterContext";
import { filterMatch } from "./filterMatch";

describe("filterMatch", () => {
    const BASE = {
        forfallsdato: "2023-01-01T00:00:00Z",
        utbetalingsdato: "2023-01-01T00:00:00Z",
    } as const;

    const FILTER_ANNEN_MOTTAKER = { mottaker: "annenMottaker" } as const;
    const FILTER_WITHIN_RANGE = { fraDato: new Date("2022-12-31"), tilDato: new Date("2023-01-02") } as const;
    const FILTER_BEFORE_FRA = { fraDato: new Date("2023-01-02") };
    const FILTER_AFTER_TIL = { tilDato: new Date("2022-12-31") };

    const expectMatch =
        (filters: FilterCriteria, expected: boolean, annenMottaker: boolean = false) =>
        () =>
            expect(filterMatch({ ...BASE, annenMottaker }, filters)).toBe(expected);

    it("true when no filters are applied", expectMatch({}, true));
    it("true for annenMottaker filter when annenMottaker is true", expectMatch(FILTER_ANNEN_MOTTAKER, true, true));
    it("false for annenMottaker filter when annenMottaker is false", expectMatch(FILTER_ANNEN_MOTTAKER, false));
    it("true when utbetalingsdato is within date range", expectMatch(FILTER_WITHIN_RANGE, true));
    it("false when utbetalingsdato is before fraDato", expectMatch(FILTER_BEFORE_FRA, false));
    it("false when utbetalingsdato is after tilDato", expectMatch(FILTER_AFTER_TIL, false));
    it("true for forfallsdato within range", expectMatch(FILTER_WITHIN_RANGE, true));
    it("false for forfallsdato out of range", expectMatch(FILTER_BEFORE_FRA, false));
});
