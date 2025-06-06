import * as R from "remeda";
import { differenceInDays } from "date-fns";

import { SaksListeResponse } from "../../../generated/model";
import {
    getSaksDetaljer,
    getSaksDetaljerResponse,
} from "../../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import { SaksDetaljerResponse } from "../../../generated/ssr/model";

import SoknadCard from "./soknadCard/SoknadCard";

interface Props {
    saker: SaksListeResponse[];
}

const fetchSaksDetaljer = (saker: SaksListeResponse[]): Promise<getSaksDetaljerResponse>[] =>
    // TODO: Filteret her tror jeg ikke trengs, da fiksDigisosId alltid skal være satt. Se TODO i innsyn-api.
    R.pipe(
        saker,
        R.filter((sak) => !!sak.fiksDigisosId),
        R.map((sak) => getSaksDetaljer(sak.fiksDigisosId!))
    );

const mergeFilterSortSaker = (saker: SaksListeResponse[], saksdetaljer: SaksDetaljerResponse[]) => {
    const combined: (Partial<SaksDetaljerResponse> & SaksListeResponse)[] = saker
        .map((sak) => ({
            ...sak,
            ...saksdetaljer.find((detaljer) => detaljer.fiksDigisosId === sak.fiksDigisosId),
        }))
        .filter(
            (sak) => sak.status !== "FERDIGBEHANDLET" || differenceInDays(new Date(), new Date(sak.sistOppdatert)) < 21
        );
    return R.pipe(combined, R.sortBy([R.pathOr(["antallNyeOppgaver"], 0), "desc"], [R.prop("sistOppdatert"), "desc"]));
};

const AktiveSoknaderList = async ({ saker }: Props) => {
    const saksdetaljer = (await Promise.all(fetchSaksDetaljer(saker)))
        .filter((it) => it.status === 200)
        .map((it) => it.data);
    const sorted = mergeFilterSortSaker(saker, saksdetaljer);
    return (
        <>
            {sorted.map((sak) => (
                <SoknadCard key={sak.fiksDigisosId} sak={sak} />
            ))}
        </>
    );
};

export default AktiveSoknaderList;
