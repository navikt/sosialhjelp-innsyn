import * as R from "remeda";
import { differenceInDays, differenceInMonths, isAfter, parseISO } from "date-fns";
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

const getForsteOppgaveFrist = (sak: Soknad): number =>
    R.pipe(sak, R.prop("forsteOppgaveFrist"), (frist) => (frist ? new Date(frist).getTime() : Number.MAX_SAFE_INTEGER));

const hasOppgaver = (sak: Soknad): number =>
    R.pipe(sak, R.prop("antallNyeOppgaver"), R.defaultTo(0), (antall) => (antall > 1 ? 1 : 0));

export const filterAndSort = (
    saker: SaksListeResponse[],
    soknadsdetaljer: SaksDetaljerResponse[],
    filter: (sak: Soknad) => boolean,
    paabegynteSaker?: PaabegyntSoknad[]
) =>
    R.pipe(
        saker,
        (s) => combineSakAndSaksdetaljer(s, soknadsdetaljer),
        R.filter(filter),
        (combined) => [...combined, ...(paabegynteSaker ?? [])],
        // Sorterer først på om saken har frist (de med frist kommer først),
        // deretter på fristdato (nærmeste frist først),
        // så på om saken har oppgaver, og til slutt på sist oppdatert.
        R.sortBy([getForsteOppgaveFrist, "asc"], [hasOppgaver, "desc"], [R.prop("sistOppdatert"), "desc"])
    );

const ferdigbehandletAndOlderThan21Days = (sak: Soknad): boolean =>
    "status" in sak &&
    sak.status === "FERDIGBEHANDLET" &&
    differenceInDays(new Date(), new Date(sak.sistOppdatert)) > 21;

const hasActiveDokumentasjonkrav = (sak: Soknad): boolean =>
    "status" in sak &&
    !!sak.sisteDokumentasjonKravFrist &&
    isAfter(parseISO(sak.sisteDokumentasjonKravFrist), new Date());

const isOlderThan2Months = (sak: Soknad): boolean =>
    "status" in sak && differenceInMonths(new Date(), parseISO(sak.sistOppdatert)) >= 2;

export const isActiveSoknad = (sak: Soknad) =>
    !isOlderThan2Months(sak) && (!ferdigbehandletAndOlderThan21Days(sak) || hasActiveDokumentasjonkrav(sak));
