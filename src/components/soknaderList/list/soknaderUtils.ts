import * as R from "remeda";
import { differenceInDays, differenceInMonths, isAfter, parseISO } from "date-fns";
import { SaksListeResponse } from "@generated/model";
import { SaksDetaljerResponse } from "@generated/ssr/model";
import { PaabegyntSoknad } from "@api/fetch/paabegynteSoknader/fetchPaabegynteSoknader";

export type SortableSoknad = { forsteOppgaveFrist?: string; antallNyeOppgaver?: number; sistOppdatert: string };

const combineSakAndSaksdetaljer = (
    saker: SaksListeResponse[],
    saksdetaljer: SaksDetaljerResponse[]
): InnsendtSoknad[] => {
    return saker
        .map((sak) => ({
            ...sak,
            ...saksdetaljer.find((detaljer) => detaljer.fiksDigisosId === sak.fiksDigisosId),
        }))
        .filter((soknad): soknad is InnsendtSoknad & SaksListeResponse => "status" in soknad);
};

const getForsteOppgaveFrist = <T extends SortableSoknad>(sak: T): number =>
    R.pipe(sak, R.prop("forsteOppgaveFrist"), (frist) => (frist ? new Date(frist).getTime() : Number.MAX_SAFE_INTEGER));

const hasOppgaver = <T extends SortableSoknad>(sak: T): number => {
    const antall = sak.antallNyeOppgaver ?? 0;
    return antall >= 1 ? 1 : 0;
};

export const combineAndPartition = (
    saker: SaksListeResponse[],
    soknadsdetaljer: SaksDetaljerResponse[]
): [InnsendtSoknad[], InnsendtSoknad[]] =>
    R.pipe(saker, (s) => combineSakAndSaksdetaljer(s, soknadsdetaljer), R.partition(isActiveSoknad));

// Sorterer først på om saken har frist (de med frist kommer først),
// deretter på fristdato (nærmeste frist først),
// så på om saken har oppgaver, og til slutt på sist oppdatert.
export const sortAktive = <T extends SortableSoknad>(items: T[]): T[] =>
    R.sortBy(items, [getForsteOppgaveFrist, "asc"], [hasOppgaver, "desc"], [R.prop("sistOppdatert"), "desc"]);

export const sortInactive = <T extends SortableSoknad>(items: T[]): T[] =>
    R.sortBy(items, [R.prop("sistOppdatert"), "desc"]);

const ferdigbehandletAndOlderThan21Days = (sak: Soknad): boolean =>
    "status" in sak &&
    (sak.status === "FERDIGBEHANDLET" || sak.status === "BEHANDLES_IKKE") && // Status BEHANDLES_IKKE skal i denne konteksten anses som ferdigbehandlet
    differenceInDays(new Date(), new Date(sak.sistOppdatert)) > 21;

const hasActiveDokumentasjonkrav = (sak: Soknad): boolean =>
    "status" in sak &&
    !!sak.sisteDokumentasjonKravFrist &&
    isAfter(parseISO(sak.sisteDokumentasjonKravFrist), new Date());

const isOlderThan2Months = (sak: Soknad): boolean =>
    "status" in sak && differenceInMonths(new Date(), parseISO(sak.sistOppdatert)) >= 2;

export const isActiveSoknad = <T extends Soknad>(sak: T): boolean =>
    !isOlderThan2Months(sak) && (!ferdigbehandletAndOlderThan21Days(sak) || hasActiveDokumentasjonkrav(sak));

export type Soknad = PaabegyntSoknad | InnsendtSoknad;

export type InnsendtSoknad = SaksDetaljerResponse | (SaksListeResponse & SaksDetaljerResponse);
