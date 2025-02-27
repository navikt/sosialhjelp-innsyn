import { FilterCriteria } from "./FilterContext";
import { filterReducer } from "./filterReducer";

describe("filterReducer", () => {
    const predFraDato: FilterCriteria = { fraDato: new Date() } as const;
    const predTilDato: FilterCriteria = { tilDato: new Date() } as const;
    const predBeggeDatoer: FilterCriteria = { ...predFraDato, ...predTilDato } as const;

    const expectReducer =
        (initialState: FilterCriteria | null, action: FilterCriteria, expected: FilterCriteria | null) => () =>
            expect(filterReducer(initialState, action)).toEqual(expected);

    it("returns state if action is empty", expectReducer(predFraDato, {}, predFraDato));
    it("returns updated state if action has values", expectReducer(predFraDato, predTilDato, predBeggeDatoer));
    it("returns null if both state and action are empty", expectReducer({}, {}, null));
    it("returns action if state is null and action has values", expectReducer(null, predFraDato, predFraDato));
    it("returns null if state is null and action is empty", expectReducer(null, {}, null));
});
