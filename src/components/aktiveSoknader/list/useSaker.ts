import { use, useState } from "react";
import { differenceInDays } from "date-fns";
import * as R from "remeda";

import { PaabegyntSak } from "../AktiveSoknader";
import type { getSaksDetaljerResponse } from "../../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import { SaksListeResponse } from "../../../generated/model";
import type { SaksDetaljerResponse } from "../../../generated/ssr/model";

const VIS_ANTALL_SAKER: number = 5;

const useSaker = (
    paabegynteSaker: PaabegyntSak[],
    saksdetaljer: Promise<getSaksDetaljerResponse[]>,
    saker: SaksListeResponse[]
) => {
    const [showAll, setShowAll] = useState(false);
    const saksdetaljerResponses = use(saksdetaljer);
    const filtered = saksdetaljerResponses.filter((it) => it.status === 200).map((it) => it.data);
    const combined: ((Partial<SaksDetaljerResponse> & SaksListeResponse) | PaabegyntSak)[] = saker
        .map((sak) => ({
            ...sak,
            ...filtered.find((detaljer) => detaljer.fiksDigisosId === sak.fiksDigisosId),
        }))
        .filter(
            (sak) => sak.status !== "FERDIGBEHANDLET" || differenceInDays(new Date(), new Date(sak.sistOppdatert)) < 21
        );
    const alleSaker = [...combined, ...paabegynteSaker];
    const sorted = R.pipe(
        alleSaker,
        R.sortBy([R.pathOr(["antallNyeOppgaver"], 0), "desc"], [R.prop("sistOppdatert"), "desc"]),
        showAll ? R.identity() : R.take(VIS_ANTALL_SAKER)
    );
    const hasMore = alleSaker.length > VIS_ANTALL_SAKER;
    return {
        showAll,
        setShowAll,
        sorted,
        hasMore,
        totaltAntallSoknader: alleSaker.length,
    };
};

export default useSaker;
