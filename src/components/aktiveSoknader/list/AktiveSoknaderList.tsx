import * as R from "remeda";
import { addDays, differenceInDays } from "date-fns";
import { logger } from "@navikt/next-logger";

import { SaksListeResponse } from "../../../generated/model";
import {
    getSaksDetaljer,
    getSaksDetaljerResponse,
} from "../../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import { SaksDetaljerResponse } from "../../../generated/ssr/model";
import { getServerEnv } from "../../../config/env";
import exchangedFetch from "../../../api/ssr/exchangedFetch";

import SoknadCard from "./soknadCard/SoknadCard";
import PaabegyntCard from "./soknadCard/status/PaabegyntCard";

interface Props {
    saker: SaksListeResponse[];
}

interface PaabegyntSak {
    eventTidspunkt: string;
    eventId: string;
    grupperingsId: string;
    tekst: string;
    link: string;
    sikkerhetsnivaa: number;
    sistOppdatert: string;
    isAktiv: boolean;
    soknadId: string;
}

const fetchPaabegynteSaker = (): Promise<PaabegyntSak[]> => {
    if (getServerEnv().NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local") {
        return Promise.resolve([]);
    }
    try {
        return exchangedFetch(
            "/dittnav/pabegynte/aktive",
            getServerEnv().SOKNAD_API_HOSTNAME,
            "/sosialhjelp/soknad-api"
        );
    } catch (e: unknown) {
        logger.error(`Feil ved henting av paabegynte saker ${e}`);
        return Promise.resolve([]);
    }
};

const fetchSaksDetaljer = (saker: SaksListeResponse[]): Promise<getSaksDetaljerResponse>[] =>
    // TODO: Filteret her tror jeg ikke trengs, da fiksDigisosId alltid skal være satt. Se TODO i innsyn-api.
    R.pipe(
        saker,
        R.filter((sak) => !!sak.fiksDigisosId),
        R.map((sak) => getSaksDetaljer(sak.fiksDigisosId!))
    );

const mergeFilterSortSaker = (
    saker: SaksListeResponse[],
    saksdetaljer: SaksDetaljerResponse[],
    paabegynteSoknader: PaabegyntSak[]
) => {
    const combined: ((Partial<SaksDetaljerResponse> & SaksListeResponse) | PaabegyntSak)[] = saker
        .map((sak) => ({
            ...sak,
            ...saksdetaljer.find((detaljer) => detaljer.fiksDigisosId === sak.fiksDigisosId),
        }))
        .filter(
            (sak) => sak.status !== "FERDIGBEHANDLET" || differenceInDays(new Date(), new Date(sak.sistOppdatert)) < 21
        );
    return R.pipe(
        [...combined, ...paabegynteSoknader],
        R.sortBy([R.pathOr(["antallNyeOppgaver"], 0), "desc"], [R.prop("sistOppdatert"), "desc"])
    );
};

const AktiveSoknaderList = async ({ saker }: Props) => {
    const [paabegynteSoknaderResponse, ...saksDetaljerResponses] = await Promise.all([
        fetchPaabegynteSaker(),
        ...fetchSaksDetaljer(saker),
    ]);
    const saksdetaljer = saksDetaljerResponses.filter((it) => it.status === 200).map((it) => it.data);
    const sorted = mergeFilterSortSaker(saker, saksdetaljer, paabegynteSoknaderResponse);
    return sorted.map((sak) => {
        if ("fiksDigisosId" in sak) {
            // This is a regular sak with fiksDigisosId
            return <SoknadCard key={sak.fiksDigisosId} sak={sak} />;
        } else if ("soknadId" in sak) {
            // This is a paabegynt sak
            return (
                <PaabegyntCard
                    soknadId={sak.soknadId}
                    keptUntil={addDays(new Date(sak.sistOppdatert), 21)}
                    key={sak.sistOppdatert}
                />
            );
        } else {
            return null;
        }
    });
};

export default AktiveSoknaderList;
