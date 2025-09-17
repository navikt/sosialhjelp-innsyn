"use client";

import { useMemo } from "react";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import type { ChipsChip } from "./Utbetalinger";
import {
    MaanedIntervall,
    kombinertManed,
    erPeriodeChip,
    datoIntervall,
    erInnenforAngittPeriode,
    utbetalingInnenforValgtDatoIntervall,
} from "./utbetalinger-utils";

type Range = { from: Date; to: Date } | null;

export const useUtbetalingerLists = ({
    valgteChip,
    nye,
    tidligere,
    valgtDatoRekke,
    kommende,
    periodeIntervall = erPeriodeChip(valgteChip) ? datoIntervall(valgteChip) : null,
}: {
    valgteChip: ChipsChip;
    nye?: NyeOgTidligereUtbetalingerResponse[];
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    valgtDatoRekke: Range;
    kommende: boolean;
    periodeIntervall?: MaanedIntervall | null;
}) => {
    const kombinert = useMemo(() => kombinertManed(nye, tidligere), [nye, tidligere]);

    const kommendeUtbetalinger = useMemo(() => {
        if (!kommende) return [];
        const tillateStatuser = new Set<ManedUtbetalingStatus>([
            ManedUtbetalingStatus.PLANLAGT_UTBETALING,
            ManedUtbetalingStatus.STOPPET,
        ]);
        // Bruker nye[] i stede for kombinert  for å unngå å vise utbetalinger som ligger i tidligere med status "stoppet"
        const nyeKilde = nye ?? [];
        return nyeKilde
            .map((gruppe) => ({
                ...gruppe,
                utbetalingerForManed: gruppe.utbetalingerForManed.filter((utbetaling) =>
                    tillateStatuser.has(utbetaling.status)
                ),
            }))
            .filter((gruppe) => gruppe.utbetalingerForManed.length > 0);
    }, [nye, kommende]);

    const periodeUtbetalinger = useMemo(() => {
        if (!periodeIntervall) return [];
        const tillateStatuser = new Set<ManedUtbetalingStatus>([
            ManedUtbetalingStatus.UTBETALT,
            ManedUtbetalingStatus.STOPPET,
        ]);
        return kombinert
            .filter((gruppe) => erInnenforAngittPeriode(gruppe, periodeIntervall))
            .map((gruppe) => ({
                ...gruppe,
                utbetalingerForManed: gruppe.utbetalingerForManed.filter((utbetaling) =>
                    tillateStatuser.has(utbetaling.status)
                ),
            }))
            .filter((gruppe) => gruppe.utbetalingerForManed.length > 0);
    }, [kombinert, periodeIntervall]);

    const egendefinertUtbetalinger = useMemo(() => {
        if (!valgtDatoRekke) return [];
        return kombinert
            .map((gruppe) => ({
                ...gruppe,
                utbetalingerForManed: gruppe.utbetalingerForManed.filter((utbetaling) =>
                    utbetalingInnenforValgtDatoIntervall(utbetaling, valgtDatoRekke.from, valgtDatoRekke.to)
                ),
            }))
            .filter((gruppe) => gruppe.utbetalingerForManed.length > 0);
    }, [kombinert, valgtDatoRekke]);

    return {
        kommendeUtbetalinger,
        periodeUtbetalinger,
        egendefinertUtbetalinger,
    };
};
