import React, { ReactNode, useReducer } from "react";

import { filterReducer } from "./lib/filterReducer";
import { filterLogAnalytics } from "./lib/filterLogAnalytics";
import { FilterContext, FilterPredicate } from "./lib/FilterContext";

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [filters, dispatch] = useReducer<FilterPredicate | null, [FilterPredicate]>(filterReducer, null);
    const clearFilters = () =>
        setFilter({
            mottaker: null,
            fraDato: null,
            tilDato: null,
        });

    const setFilter = (predicates: FilterPredicate) => {
        filterLogAnalytics(predicates);
        dispatch(predicates);
    };

    const value = { filters, setFilter, clearFilters };

    return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};
