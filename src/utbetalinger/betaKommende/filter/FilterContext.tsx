import React, {PropsWithChildren, useContext, useState} from "react";

export type MottakerFilter = "minKonto" | "annenMottaker";
export interface FilterKey {
    mottaker: MottakerFilter[];
    fraDato?: Date;
    tilDato?: Date;
}
type FilterContextType = {filter: FilterKey; oppdaterFilter: (nyttFilter: Partial<FilterKey>) => void};

const FilterContext = React.createContext<FilterContextType | undefined>(undefined);

// Egen hook fordi det sjekkes at den blir brukt riktig, og kan ha undefined som defaultValue
export const useFilter = () => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error("Kan kun brukes innenfor FilterProvider");
    }
    return context;
};

export const FilterProvider = (props: PropsWithChildren<{}>) => {
    const [filter, setFilter] = useState<FilterKey>({
        mottaker: [],
        tilDato: undefined,
        fraDato: undefined,
    });

    const oppdaterFilter = (nyttFilter: Partial<FilterKey>) => {
        const updatedFilter = {...filter, ...nyttFilter};
        setFilter(updatedFilter);
    };

    return (
        <FilterContext.Provider
            value={{
                filter,
                oppdaterFilter,
            }}
        >
            {props.children}
        </FilterContext.Provider>
    );
};
