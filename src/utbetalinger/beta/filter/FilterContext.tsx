import React, { ReactNode, useContext, useReducer } from "react";

import { logAmplitudeEvent } from "../../../utils/amplitude";

type Maybe<T> = T | null;

export type MottakerFilter = "minKonto" | "annenMottaker";

export type FilterPredicate = {
    mottaker?: Maybe<MottakerFilter>;
    fraDato?: Maybe<Date>;
    tilDato?: Maybe<Date>;
};

type FilterContextType = {
    filters: FilterPredicate | null;
    setFilter: (nyttFilter: FilterPredicate) => void;
    clearFilters: () => void;
};

const FilterContext = React.createContext<FilterContextType | undefined>(undefined);

// Egen hook fordi det sjekkes at den blir brukt riktig, og kan ha undefined som defaultValue
export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) throw new Error("Kan kun brukes innenfor FilterProvider");
    return context;
};

const filterReducer = (state: FilterPredicate | null, action: FilterPredicate) => {
    const updates = Object.keys(action).filter((key) => action[key as keyof FilterPredicate] !== undefined);
    if (!updates.length) return state;

    updates.map((field) =>
        logAmplitudeEvent("filtervalg", { kategori: field, filternavn: action[field as keyof FilterPredicate] })
    );

    const newState: FilterPredicate = { ...state, ...action };
    const nonNullFields = Object.values(newState).filter((value) => value !== null);
    if (!nonNullFields.length) return null;
    return newState;
};

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [filters, setFilter] = useReducer<FilterPredicate | null, [FilterPredicate]>(filterReducer, null);
    const clearFilters = () => setFilter({ mottaker: null, fraDato: null, tilDato: null });
    return <FilterContext.Provider value={{ filters, setFilter, clearFilters }}>{children}</FilterContext.Provider>;
};
