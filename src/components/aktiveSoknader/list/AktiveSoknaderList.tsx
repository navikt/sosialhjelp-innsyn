"use client";

import * as R from "remeda";
import { addDays, differenceInDays } from "date-fns";
import { use } from "react";
import { Fragment } from "react";

import { SaksListeResponse } from "../../../generated/model";
import type { getSaksDetaljerResponse } from "../../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import type { SaksDetaljerResponse } from "../../../generated/ssr/model";
import { PaabegyntSak } from "../AktiveSoknader";

import SoknadCard from "./soknadCard/SoknadCard";
import PaabegyntCard from "./soknadCard/status/PaabegyntCard";

interface Props {
    paabegynteSaker: PaabegyntSak[];
    saksdetaljer: Promise<getSaksDetaljerResponse[]>;
    saker: SaksListeResponse[];
}

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
    return R.sortBy(
        [...combined, ...paabegynteSoknader],
        [R.pathOr(["antallNyeOppgaver"], 0), "desc"],
        [R.prop("sistOppdatert"), "desc"]
    );
};

const AktiveSoknaderList = ({ saker, paabegynteSaker, saksdetaljer }: Props) => {
    const saksdetaljerResponses = use(saksdetaljer);
    const filtered = saksdetaljerResponses.filter((it) => it.status === 200).map((it) => it.data);
    const sorted = mergeFilterSortSaker(saker, filtered, paabegynteSaker);
    return sorted.map((sak) => {
        return (
            <Fragment
                key={"fiksDigisosId" in sak ? sak.fiksDigisosId : "soknadId" in sak ? sak.soknadId : sak.sistOppdatert}
            >
                {"fiksDigisosId" in sak && <SoknadCard key={sak.fiksDigisosId} sak={sak} />}
                {"soknadId" in sak && (
                    <PaabegyntCard
                        soknadId={sak.soknadId}
                        keptUntil={addDays(new Date(sak.sistOppdatert), 21)}
                        key={sak.sistOppdatert}
                    />
                )}
            </Fragment>
        );
    });
};

export default AktiveSoknaderList;
