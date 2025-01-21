import { useMemo } from "react";
import { useTranslation } from "next-i18next";

import { dateToDDMMYYYY } from "../../../utils/formatting";

import { FilterPredicate, useFilter } from "./FilterContext";

type ChipType = {
    label: string;
    filterType: keyof FilterPredicate;
};

const useChips = () => {
    const { fraDato, mottaker, tilDato } = useFilter().filters || {};
    const translation = useTranslation("utbetalinger");

    const chips: ChipType[] = useMemo(
        () =>
            [
                fraDato && {
                    label: `${translation.t("filter.fra")}: ${dateToDDMMYYYY(translation.i18n.language, fraDato)}`,
                    filterType: "fraDato",
                },
                tilDato && {
                    label: `${translation.t("filter.fra")}: ${dateToDDMMYYYY(translation.i18n.language, tilDato)}`,
                    filterType: "tilDato",
                },
                mottaker && {
                    label: (mottaker: string) => translation.t(`filter.${mottaker}` as const),
                    filterType: "mottaker",
                },
            ].filter(Boolean) as ChipType[],
        [fraDato, tilDato, mottaker, translation]
    );

    return { chips };
};
export default useChips;
