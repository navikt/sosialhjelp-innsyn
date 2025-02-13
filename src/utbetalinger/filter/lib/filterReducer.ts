import { FilterPredicate } from "./FilterContext";

const nullIfEmpty = (action: FilterPredicate) => (Object.values(action).some((value) => !!value) ? action : null);

export const filterReducer = (state: FilterPredicate | null, action: FilterPredicate) =>
    nullIfEmpty({ ...(state ?? {}), ...action });
