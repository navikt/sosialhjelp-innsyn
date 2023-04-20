import React, {PropsWithChildren, useContext, useState} from "react";

export enum MottakerFilter {
    Alle = "ALLE",
    MinKonto = "MIN_KONTO",
    AnnenMottaker = "ANNEN_MOTTAKER",
}
export interface FilterKey {
    mottaker: MottakerFilter;
    fraDato?: Date;
    tilDato?: Date;
}
type FilterContextType = {
    filter: FilterKey;
    oppdaterFilter: (nyttFilter: Partial<FilterKey>) => void;
    isUsingFilter: boolean;
};

const FilterContext = React.createContext<FilterContextType | undefined>(undefined);

// Egen hook fordi det sjekkes at den blir brukt riktig, og kan ha undefined som defaultValue
export const useFilter = () => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error("Kan kun brukes innenfor FilterProvider");
    }
    return context;
};

const initialState: FilterKey = {
    mottaker: MottakerFilter.Alle,
    tilDato: undefined,
    fraDato: undefined,
};
export const FilterProvider = (props: PropsWithChildren<{}>) => {
    const [filter, setFilter] = useState<FilterKey>(initialState);

    const oppdaterFilter = (nyttFilter: Partial<FilterKey>) => {
        const updatedFilter = {...filter, ...nyttFilter};
        setFilter(updatedFilter);
    };

    return (
        <FilterContext.Provider
            value={{
                filter,
                oppdaterFilter,
                isUsingFilter: JSON.stringify(filter) !== JSON.stringify(initialState),
            }}
        >
            {props.children}
        </FilterContext.Provider>
    );
};
