import { Interval } from "date-fns";
import { useMemo } from "react";

import { ManedUtbetalingStatus, UtbetalingDto } from "@generated/model";
import { useHentUtbetalingerSuspense } from "@generated/utbetalinger-controller-2/utbetalinger-controller-2";

import {
    erPeriodeChip,
    datoIntervall,
    utbetalingInnenforIntervall,
    grupperUtbetalingerEtterManed,
} from "../../_utils/utbetalinger-utils";
import { Option, State } from "../utbetalingerReducer";

interface Props {
    selectedState: State;
}

const tillatteStatuserKommende = new Set<ManedUtbetalingStatus>([
    ManedUtbetalingStatus.PLANLAGT_UTBETALING,
    ManedUtbetalingStatus.STOPPET,
]);

const tillateStatuserPeriode = new Set<ManedUtbetalingStatus>([
    ManedUtbetalingStatus.UTBETALT,
    ManedUtbetalingStatus.STOPPET,
]);

const chipToData = (selectedChip: Option, data: UtbetalingDto[], selectedRange?: Interval) => {
    const intervall = erPeriodeChip(selectedChip) && datoIntervall(selectedChip);
    switch (selectedChip) {
        case "kommende":
            return data.filter(
                (utbetaling) =>
                    tillatteStatuserKommende.has(utbetaling.status) ||
                    (utbetaling.forfallsdato && new Date(utbetaling.forfallsdato) > new Date())
            );
        case "egendefinert":
            if (!selectedRange) return null;
            return data.filter((utbetaling) => utbetalingInnenforIntervall(utbetaling, selectedRange));
        case "siste3":
        case "hittil":
        case "fjor":
            if (!intervall) return null;
            return data.filter(
                (utbetaling) =>
                    tillateStatuserPeriode.has(utbetaling.status) && utbetalingInnenforIntervall(utbetaling, intervall)
            );
    }
};

export const useUtbetalinger = ({ selectedState }: Props) => {
    const { data } = useHentUtbetalingerSuspense();

    const selectedInterval = selectedState.chip === "egendefinert" ? selectedState.interval : undefined;

    const processedData = useMemo(() => {
        if (!data) {
            return [];
        }

        const datas = chipToData(selectedState.chip, data, selectedInterval);

        return datas ? grupperUtbetalingerEtterManed(datas) : [];
    }, [data, selectedState.chip, selectedInterval]);

    return { data: processedData };
};
