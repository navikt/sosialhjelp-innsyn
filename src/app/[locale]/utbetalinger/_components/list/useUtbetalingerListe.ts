import { useMemo } from "react";

import { useHentUtbetalingerSuspense } from "@generated/utbetalinger-controller-2/utbetalinger-controller-2";

import { grupperUtbetalingerEtterManed, filtrerUtbetalinger } from "../../_utils/utbetalinger-utils";
import { State } from "../utbetalingerReducer";

interface Props {
    selectedState: State;
}

export const useUtbetalinger = ({ selectedState }: Props) => {
    const { data } = useHentUtbetalingerSuspense();

    const selectedInterval = selectedState.chip === "egendefinert" ? selectedState.interval : undefined;

    const processedData = useMemo(() => {
        if (!data) {
            return [];
        }

        const filtrerteData = filtrerUtbetalinger(selectedState.chip, data, selectedInterval);

        return filtrerteData ? grupperUtbetalingerEtterManed(filtrerteData) : [];
    }, [data, selectedState.chip, selectedInterval]);

    return { data: processedData };
};
