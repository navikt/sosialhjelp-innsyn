import { createContext } from "react";

type Maybe<T> = T | null;

export type MottakerFilter = "minKonto" | "annenMottaker";

export type FilterPredicate = {
    mottaker?: Maybe<MottakerFilter>;
    fraDato?: Maybe<Date>;
    tilDato?: Maybe<Date>;
};

export type FilterKey = keyof FilterPredicate;

type FilterContextType = {
    filters: FilterPredicate | null;
    setFilter: (nyttFilter: FilterPredicate) => void;
    clearFilters: () => void;
};

export const FilterContext = createContext<FilterContextType | undefined>(undefined);
