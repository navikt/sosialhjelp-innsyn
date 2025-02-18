import { createContext } from "react";

type Maybe<T> = T | null;

export type MottakerFilter = "minKonto" | "annenMottaker";

export type FilterCriteria = {
    mottaker?: Maybe<MottakerFilter>;
    fraDato?: Maybe<Date>;
    tilDato?: Maybe<Date>;
};

export type FilterKey = keyof FilterCriteria;

type FilterContextType = {
    filters: FilterCriteria | null;
    setFilter: (nyttFilter: FilterCriteria) => void;
    clearFilters: () => void;
};

export const FilterContext = createContext<FilterContextType | undefined>(undefined);
