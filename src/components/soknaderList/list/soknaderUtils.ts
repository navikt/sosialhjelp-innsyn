import * as R from "remeda";
import { differenceInDays } from "date-fns";

import { SaksListeResponse } from "@generated/model";
import { SaksDetaljerResponse } from "@generated/ssr/model";
import { PaabegyntSoknad } from "@api/fetch/paabegynteSoknader/fetchPaabegynteSoknader";

export type Soknad = (Partial<SaksDetaljerResponse> & SaksListeResponse) | PaabegyntSoknad;

const combineSakAndSaksdetaljer = (saker: SaksListeResponse[], saksdetaljer: SaksDetaljerResponse[]) => {
    return saker.map((sak) => ({
        ...sak,
        ...saksdetaljer.find((detaljer) => detaljer.fiksDigisosId === sak.fiksDigisosId),
    }));
};

export const filterAndSort = (
    saker: SaksListeResponse[],
    soknadsdetaljer: SaksDetaljerResponse[],
    filter: (sak: Soknad) => boolean,
    paabegynteSaker?: PaabegyntSoknad[]
) => {
    const combined: Soknad[] = combineSakAndSaksdetaljer(saker, soknadsdetaljer).filter(filter);
    // Påbegynte saker skal legges til etter filtrering, da de alltid er aktive.
    const alleSaker = [...combined, ...(paabegynteSaker ?? [])];
    // Sorterer først på antall nye oppgaver (eller 0), deretter på sist oppdatert.
    return R.sortBy(alleSaker, [R.pathOr(["antallNyeOppgaver"], 0), "desc"], [R.prop("sistOppdatert"), "desc"]);
};

export const ferdigbehandletAndOlderThan21Days = (sak: Soknad): boolean =>
    "status" in sak &&
    sak.status === "FERDIGBEHANDLET" &&
    differenceInDays(new Date(), new Date(sak.sistOppdatert)) > 21;
