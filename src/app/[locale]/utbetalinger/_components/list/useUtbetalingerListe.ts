import { useMemo } from "react";
import { Interval } from "date-fns";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse, UtbetalingDto } from "@generated/model";
import {
    useHentNyeUtbetalingerSuspense,
    useHentTidligereUtbetalingerSuspense,
} from "@generated/utbetalinger-controller/utbetalinger-controller";
import { useHentUtbetalinger } from "@generated/utbetalinger-controller-2/utbetalinger-controller-2";

import {
    kombinertManed,
    erPeriodeChip,
    datoIntervall,
    erInnenforIntervall,
    utbetalingInnenforIntervall,
    grupperUtbetalingerEtterManed,
} from "../../_utils/utbetalinger-utils";
import type { Option } from "../Utbetalinger";
import { State } from "../utbetalingerReducer";

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

const chipToData = (
    selectedChip: Option,
    nye: NyeOgTidligereUtbetalingerResponse[],
    kombinert: NyeOgTidligereUtbetalingerResponse[],
    selectedRange?: Interval
) => {
    const intervall = erPeriodeChip(selectedChip) && datoIntervall(selectedChip);
    switch (selectedChip) {
        case "kommende":
            return nye
                .map((gruppe) => ({
                    // Bruker nye[] i stede for kombinert for å unngå å vise utbetalinger som ligger i tidligere[] med status "stoppet"
                    ...gruppe,
                    utbetalingerForManed: gruppe.utbetalingerForManed.filter(
                        (utbetaling) =>
                            tillatteStatuserKommende.has(utbetaling.status) ||
                            (utbetaling.forfallsdato && new Date(utbetaling.forfallsdato) > new Date())
                    ),
                }))
                .filter((gruppe) => gruppe.utbetalingerForManed.length > 0);
        case "egendefinert":
            if (!selectedRange) return null;
            return kombinert
                .map((gruppe) => ({
                    ...gruppe,
                    utbetalingerForManed: gruppe.utbetalingerForManed.filter((utbetaling) =>
                        utbetalingInnenforIntervall(utbetaling, selectedRange)
                    ),
                }))
                .filter((gruppe) => gruppe.utbetalingerForManed.length > 0);
        case "siste3":
        case "hittil":
        case "fjor":
            if (!intervall) return null;
            return kombinert
                .filter((gruppe) => erInnenforIntervall(gruppe, intervall))
                .map((gruppe) => ({
                    ...gruppe,
                    utbetalingerForManed: gruppe.utbetalingerForManed.filter(
                        (utbetaling) =>
                            tillateStatuserPeriode.has(utbetaling.status) &&
                            utbetalingInnenforIntervall(utbetaling, intervall)
                    ),
                }))
                .filter((gruppe) => gruppe.utbetalingerForManed.length > 0);
    }
};

const chipToData2 = (selectedChip: Option, data: UtbetalingDto[], selectedRange?: Interval) => {
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
    const { data: nye } = useHentNyeUtbetalingerSuspense();
    const { data: tidligere } = useHentTidligereUtbetalingerSuspense();
    const kombinert = useMemo(() => kombinertManed(nye, tidligere), [nye, tidligere]);

    const datas = chipToData(
        selectedState.chip,
        nye,
        kombinert,
        selectedState.chip === "egendefinert" ? selectedState.interval : undefined
    );

    return datas ?? [];
};

export const useUtbetalinger2 = ({ selectedState }: Props) => {
    const { data } = useHentUtbetalinger();

    if (!data) {
        return [];
    }

    const datas = chipToData2(
        selectedState.chip,
        data,
        selectedState.chip === "egendefinert" ? selectedState.interval : undefined
    );

    return datas ? grupperUtbetalingerEtterManed(datas) : [];
};
