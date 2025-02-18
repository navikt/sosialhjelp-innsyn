import { FilterCriteria } from "./FilterContext";

const nullIfEmpty = (action: FilterCriteria) => (Object.values(action).some((value) => !!value) ? action : null);

export const filterReducer = (state: FilterCriteria | null, action: FilterCriteria) =>
    nullIfEmpty({ ...(state ?? {}), ...action });
