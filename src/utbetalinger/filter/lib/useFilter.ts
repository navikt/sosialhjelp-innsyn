import { useContext } from "react";

import { FilterContext } from "./FilterContext";

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) throw new Error("Kan kun brukes innenfor FilterProvider");
    return context;
};
