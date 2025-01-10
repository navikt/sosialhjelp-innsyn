import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {i18n} from "i18next";

import {dateToDDMMYYYY} from "../../../utils/formatting";

import {MottakerFilter, useFilter} from "./FilterContext";

const mottakerFilterToChip = (value: MottakerFilter, t: (key: string) => string) => {
    switch (value) {
        case MottakerFilter.Alle:
            return undefined;
        case MottakerFilter.MinKonto:
            return {label: t("utbetalinger:filter.minKonto"), filterType: "mottaker"} as ChipType;
        case MottakerFilter.AnnenMottaker:
            return {label: t("utbetalinger:filter.annen"), filterType: "mottaker"} as ChipType;
    }
};
const datoFilterToChip = (i18n: i18n, fom?: Date, tom?: Date) => {
    if (fom && tom) {
        return {
            label: `${dateToDDMMYYYY(i18n.language, fom)} - ${dateToDDMMYYYY(i18n.language, tom)}`,
            filterType: "dato",
        } as ChipType;
    } else if (fom) {
        return {
            label: `${i18n.t("utbetalinger:filter.fra")}: ${dateToDDMMYYYY(i18n.language, fom)}`,
            filterType: "dato",
        } as ChipType;
    } else if (tom) {
        return {
            label: `${i18n.t("utbetalinger:filter.til")}: ${dateToDDMMYYYY(i18n.language, tom)}`,
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
    const {t, i18n} = useTranslation();

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
        const mottaker: ChipType | undefined = mottakerFilterToChip(filter.mottaker, t);
        const dato = datoFilterToChip(i18n, filter.fraDato, filter.tilDato);

        // remove empty string
        setChips([mottaker, dato].filter(Boolean) as ChipType[]);
    }, [filter, i18n, t]);
    return {chips, removeChip};
};
export default useChips;
