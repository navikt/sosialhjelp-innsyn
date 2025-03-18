import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import { getSaksDetaljer } from "../generated/saks-oversikt-controller/saks-oversikt-controller";
import { SaksListeResponse, SaksDetaljerResponse } from "../generated/model";

export const useSaksDetaljerQueries = (saker: SaksListeResponse[]) => {
    const [soknadDetaljer, setSoknadDetaljer] = useState<Record<string, SaksDetaljerResponse>>({});
    const [completedFetches, setCompletedFetches] = useState(0);

    const saksDetaljerQueries = useQueries({
        queries: saker.map((sak) => ({
            queryKey: ["saksDetaljer", sak.fiksDigisosId],
            queryFn: async () => {
                if (!sak.fiksDigisosId || sak.kilde !== "innsyn-api") return null;
                return getSaksDetaljer(sak.fiksDigisosId);
            },
            enabled: sak.kilde === "innsyn-api" && !!sak.fiksDigisosId,
        })),
    });

    useEffect(() => {
        let fetches = 0;
        saksDetaljerQueries.forEach((query, index) => {
            const sak = saker[index];
            const id = sak.fiksDigisosId ? String(sak.fiksDigisosId) : null;

            if (query.isSuccess && id && query.data) {
                setSoknadDetaljer((prev) => ({
                    ...prev,
                    [id]: query.data as SaksDetaljerResponse,
                }));
                fetches++;
            }
        });
        setCompletedFetches(fetches);
    }, [saksDetaljerQueries, saker]);

    return { soknadDetaljer, completedFetches };
};
