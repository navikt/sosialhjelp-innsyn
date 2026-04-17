import {
    getHentHendelserQueryKey,
    getHentHendelserBetaQueryKey,
} from "@generated/hendelse-controller/hendelse-controller";
import { getHentVedleggQueryKey } from "@generated/vedlegg-controller/vedlegg-controller";
import { getGetVedleggForOppgaveQueryKey } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";
import { getGetSaksDetaljerQueryKey } from "@generated/saks-oversikt-controller/saks-oversikt-controller";

export const getQueryKeysForInvalidation = (fiksDigisosId: string, oppgaveId?: string): string[] =>
    [
        getHentVedleggQueryKey(fiksDigisosId),
        getHentHendelserQueryKey(fiksDigisosId),
        getHentHendelserBetaQueryKey(fiksDigisosId),
        getGetVedleggForOppgaveQueryKey(fiksDigisosId, oppgaveId),
        getGetSaksDetaljerQueryKey(fiksDigisosId),
    ].flat();
