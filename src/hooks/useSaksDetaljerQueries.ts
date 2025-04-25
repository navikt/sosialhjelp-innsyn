import { useQueries } from "@tanstack/react-query";

import { getGetSaksDetaljerQueryOptions } from "../generated/saks-oversikt-controller/saks-oversikt-controller";
import { SaksListeResponse, SaksDetaljerResponse } from "../generated/model";

export const useSaksDetaljerQueries = (saker: SaksListeResponse[]) => {
    const saksDetaljerQueries = useQueries({
        queries: saker
            .filter((sak) => sak.fiksDigisosId && sak.kilde === "innsyn-api")
            .map((sak) => getGetSaksDetaljerQueryOptions(sak.fiksDigisosId ?? "")),
    });

    const soknadDetaljer = saksDetaljerQueries.filter((it) => it.isSuccess && it.data).map((it) => it.data);
    return {
        soknadDetaljer: soknadDetaljer as SaksDetaljerResponse[],
        isLoading: saksDetaljerQueries.some((query) => query.isLoading),
    };
};
