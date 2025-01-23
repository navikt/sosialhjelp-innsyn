import { FilterPredicate } from "./FilterContext";

const nullIfEmpty = (action: FilterPredicate) => (Object.values(action).some((value) => !!value) ? action : null);

export const filterReducer = (s: FilterPredicate | null, a: FilterPredicate) => nullIfEmpty({ ...(s ?? {}), ...a });
