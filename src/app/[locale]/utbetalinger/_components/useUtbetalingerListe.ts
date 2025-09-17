"use client";

import { useMemo } from "react";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import type { ChipsChip } from "./Utbetalinger";
import {
    kombinertManed,
    erPeriodeChip,
    datoIntervall,
    erInnenforAngittPeriode,
    utbetalingInnenforValgtDatoIntervall,
} from "./utbetalinger-utils";

type Intervall = { from: Date; to: Date } | null;

interface Props {
    valgteChip: ChipsChip;
    nye?: NyeOgTidligereUtbetalingerResponse[];
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    valgtDatointervall: Intervall;
}

export const filtreringAvUtbetalinger = ({ valgteChip, nye, tidligere, valgtDatointervall }: Props) => {
    const kommende = valgteChip === "kommende.kort";
    const periodeIntervall = erPeriodeChip(valgteChip) ? datoIntervall(valgteChip) : null;
    const kombinert = kombinertManed(nye, tidligere);

    const tillateStatuserKommende = new Set<ManedUtbetalingStatus>([
        ManedUtbetalingStatus.PLANLAGT_UTBETALING,
        ManedUtbetalingStatus.STOPPET,
    ]);

    const kommendeUtbetalinger = kommende
        ? (nye ?? []) // Bruker nye[] i stede for kombinert  for å unngå å vise utbetalinger som ligger i tidligere med status "stoppet"
              .map((gruppe) => ({
                  ...gruppe,
                  utbetalingerForManed: gruppe.utbetalingerForManed.filter((utbetaling) =>
                      tillateStatuserKommende.has(utbetaling.status)
                  ),
              }))
              .filter((gruppe) => gruppe.utbetalingerForManed.length > 0)
        : [];

    const tillateStatuserPeriode = new Set<ManedUtbetalingStatus>([
        ManedUtbetalingStatus.UTBETALT,
        ManedUtbetalingStatus.STOPPET,
    ]);

    const periodeUtbetalinger = periodeIntervall
        ? kombinert
              .filter((gruppe) => erInnenforAngittPeriode(gruppe, periodeIntervall))
              .map((gruppe) => ({
                  ...gruppe,
                  utbetalingerForManed: gruppe.utbetalingerForManed.filter((utbetaling) =>
                      tillateStatuserPeriode.has(utbetaling.status)
                  ),
              }))
              .filter((gruppe) => gruppe.utbetalingerForManed.length > 0)
        : [];

    const egendefinertUtbetalinger = valgtDatointervall
        ? kombinert
              .map((gruppe) => ({
                  ...gruppe,
                  utbetalingerForManed: gruppe.utbetalingerForManed.filter((utbetaling) =>
                      utbetalingInnenforValgtDatoIntervall(utbetaling, valgtDatointervall.from, valgtDatointervall.to)
                  ),
              }))
              .filter((gruppe) => gruppe.utbetalingerForManed.length > 0)
        : [];

    return {
        kommendeUtbetalinger,
        periodeUtbetalinger,
        egendefinertUtbetalinger,
    };
};

export const useUtbetalingerLists = ({
    valgteChip,
    nye,
    tidligere,
    valgtDatointervall,
}: {
    valgteChip: ChipsChip;
    nye?: NyeOgTidligereUtbetalingerResponse[];
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    valgtDatointervall: Intervall;
}) => {
    return useMemo(
        () => filtreringAvUtbetalinger({ valgteChip, nye, tidligere, valgtDatointervall: valgtDatointervall }),
        [valgteChip, nye, tidligere, valgtDatointervall]
    );
};
