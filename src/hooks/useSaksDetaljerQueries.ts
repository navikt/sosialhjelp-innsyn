import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import { getSaksDetaljer } from "../generated/saks-oversikt-controller/saks-oversikt-controller"; // ✅ Use function instead of hook
import { SaksListeResponse, SaksDetaljerResponse } from "../generated/model";

export const useSaksDetaljerQueries = (saker: SaksListeResponse[]) => {
    const [soknadDetaljer, setSoknadDetaljer] = useState<Record<string, SaksDetaljerResponse>>({});
    const [completedFetches, setCompletedFetches] = useState(0);

    // ✅ Use function instead of hook in queryFn
    const saksDetaljerQueries = useQueries({
        queries: saker.map((sak) => ({
            queryKey: ["saksDetaljer", sak.fiksDigisosId],
            queryFn: async () => {
                if (!sak.fiksDigisosId || sak.kilde !== "innsyn-api") return null;
                return getSaksDetaljer(sak.fiksDigisosId); // ✅ Fetch function instead of hook
            },
            enabled: sak.kilde === "innsyn-api" && !!sak.fiksDigisosId,
        })),
    });

    useEffect(() => {
        let fetches = 0;
        saksDetaljerQueries.forEach((query, index) => {
            const sak = saker[index];
            const id = sak.fiksDigisosId ? String(sak.fiksDigisosId) : null; // Ensure valid ID

            if (query.isSuccess && id && query.data) {
                setSoknadDetaljer((prev) => ({
                    ...prev,
                    [id]: query.data as SaksDetaljerResponse, // ✅ Ensure correct type
                }));
                fetches++;
            }
        });
        setCompletedFetches(fetches);
    }, [saksDetaljerQueries, saker]);

    return { soknadDetaljer, completedFetches };
};
