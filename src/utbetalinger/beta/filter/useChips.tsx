import {useCallback, useEffect, useState} from "react";
import {MottakerFilter, useFilter} from "./FilterContext";
import {dateToDDMMYYYY} from "../../../utils/formatting";
import {useTranslation} from "react-i18next";

const mottakerFilterToChip = (value: MottakerFilter) => {
    switch (value) {
        case MottakerFilter.Alle:
            return undefined;
        case MottakerFilter.MinKonto:
            return {label: "Min konto", filterType: "mottaker"} as ChipType;
        case MottakerFilter.AnnenMottaker:
            return {label: "Annen mottaker", filterType: "mottaker"} as ChipType;
    }
};
const datoFilterToChip = (language: string, fom?: Date, tom?: Date) => {
    if (fom && tom) {
        return {
            label: `${dateToDDMMYYYY(language, fom)} - ${dateToDDMMYYYY(language, tom)}`,
            filterType: "dato",
        } as ChipType;
    } else if (fom) {
        return {label: `Fra: ${dateToDDMMYYYY(language, fom)}`, filterType: "dato"} as ChipType;
    } else if (tom) {
        return {label: `Til: ${dateToDDMMYYYY(language, tom)}`, filterType: "dato"} as ChipType;
    }
    return undefined;
};

type FilterType = "mottaker" | "dato";
interface ChipType {
    label: string;
    filterType: FilterType;
}
const useChips = () => {
    const [chips, setChips] = useState<ChipType[]>([]);
    const {filter, oppdaterFilter} = useFilter();
    const {i18n} = useTranslation();

    const removeChip = useCallback(
        (type: FilterType) => {
            if (type === "mottaker") {
                oppdaterFilter({...filter, mottaker: MottakerFilter.Alle});
            } else if (type === "dato") {
                oppdaterFilter({...filter, tilDato: undefined, fraDato: undefined});
            }
        },
        [filter, oppdaterFilter]
    );
    useEffect(() => {
        const mottaker: ChipType | undefined = mottakerFilterToChip(filter.mottaker);
        const dato = datoFilterToChip(i18n.language, filter.fraDato, filter.tilDato);

        // remove empty string
        setChips([mottaker, dato].filter(Boolean) as ChipType[]);
    }, [filter, i18n.language]);
    return {chips, removeChip};
};
export default useChips;
