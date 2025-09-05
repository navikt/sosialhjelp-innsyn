"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";

export type ChipsChip = "kommende" | "siste3" | "hittil" | "fjor" | "egendefinert";

interface ChipsContext {
    selectedChip: ChipsChip;
    setSelectedChip: (chip: ChipsChip) => void;
}

const defaultChipSelected: ChipsContext = {
    selectedChip: "kommende",
    setSelectedChip: () => {},
};

const UtbetalingerChipContext = createContext<ChipsContext>(defaultChipSelected);

export const useUtbetalingerChip = () => useContext(UtbetalingerChipContext);

export const UtbetalingerChipProvider = ({ children }: PropsWithChildren) => {
    const [selectedChip, setSelectedChip] = useState<ChipsChip>(defaultChipSelected.selectedChip);
    return (
        <UtbetalingerChipContext.Provider value={{ selectedChip, setSelectedChip }}>
            {children}
        </UtbetalingerChipContext.Provider>
    );
};
