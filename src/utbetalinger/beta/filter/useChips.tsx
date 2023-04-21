import {useCallback, useEffect, useState} from "react";
import {MottakerFilter, useFilter} from "./FilterContext";
import {dateToDDMMYYYY} from "../../../utils/formatting";
import i18next from "../../../locales/i18n";

const mottakerFilterToChip = (value: MottakerFilter) => {
    switch (value) {
        case MottakerFilter.Alle:
            return undefined;
        case MottakerFilter.MinKonto:
            return {label: i18next.t("utbetalinger:filter.minKonto"), filterType: "mottaker"} as ChipType;
        case MottakerFilter.AnnenMottaker:
            return {label: i18next.t("utbetalinger:filter.annen"), filterType: "mottaker"} as ChipType;
    }
};
const datoFilterToChip = (fom?: Date, tom?: Date) => {
    if (fom && tom) {
        return {
            label: `${dateToDDMMYYYY(i18next.language, fom)} - ${dateToDDMMYYYY(i18next.language, tom)}`,
            filterType: "dato",
        } as ChipType;
    } else if (fom) {
        return {
            label: `${i18next.t("utbetalinger:filter.fra")}: ${dateToDDMMYYYY(i18next.language, fom)}`,
            filterType: "dato",
        } as ChipType;
    } else if (tom) {
        return {
            label: `${i18next.t("utbetalinger:filter.til")}: ${dateToDDMMYYYY(i18next.language, tom)}`,
            filterType: "dato",
        } as ChipType;
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
        const dato = datoFilterToChip(filter.fraDato, filter.tilDato);

        // remove empty string
        setChips([mottaker, dato].filter(Boolean) as ChipType[]);
    }, [filter]);
    return {chips, removeChip};
};
export default useChips;
