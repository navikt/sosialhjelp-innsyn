import {Dispatch} from "redux";
import {fetchToJson, HttpErrorType, REST_STATUS} from "../../utils/restUtils";
import {
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    oppdaterInnsynsdataState,
    oppdaterSaksdetaljerRestStatus,
    oppdaterSaksdetaljerState,
    settRestStatus,
    skalViseFeilside,
    oppdaterOppgaveState,
    skalViseForbudtside,
} from "./innsynsdataReducer";
import {logErrorMessage} from "./loggActions";

export const innsynsdataUrl = (fiksDigisosId: string, sti: string): string => `/innsyn/${fiksDigisosId}/${sti}`;

export function hentInnsynsdata(fiksDigisosId: string | string, sti: InnsynsdataSti, visFeilSide?: boolean) {
    return (dispatch: Dispatch) => {
        dispatch(settRestStatus(sti, REST_STATUS.PENDING));
        let url = innsynsdataUrl(fiksDigisosId, sti);
        fetchToJson(url)
            .then((response: any) => {
                dispatch(oppdaterInnsynsdataState(sti, response));
                dispatch(settRestStatus(sti, REST_STATUS.OK));
            })
            .catch((reason) => {
                if (reason.message === HttpErrorType.UNAUTHORIZED) {
                    dispatch(settRestStatus(sti, REST_STATUS.UNAUTHORIZED));
                } else if (reason.message === HttpErrorType.FORBIDDEN) {
                    logErrorMessage(reason.message, reason.navCallId);
                    dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                    dispatch(skalViseForbudtside(true));
                } else {
                    logErrorMessage(reason.message, reason.navCallId);
                    dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                    if (visFeilSide !== false) {
                        dispatch(skalViseFeilside(true));
                    }
                }
            });
    };
}

export function hentOppgaveMedId(fiksDigisosId: string, sti: InnsynsdataSti, oppgaveId: string) {
    return (dispatch: Dispatch) => {
        dispatch(settRestStatus(sti, REST_STATUS.PENDING));
        const url = `${innsynsdataUrl(fiksDigisosId, sti)}/${oppgaveId}`;
        fetchToJson(url)
            .then((response: any) => {
                dispatch(oppdaterOppgaveState(oppgaveId, response));
                dispatch(settRestStatus(sti, REST_STATUS.OK));
            })
            .catch((reason) => {
                if (reason.message === HttpErrorType.UNAUTHORIZED) {
                    dispatch(settRestStatus(sti, REST_STATUS.UNAUTHORIZED));
                } else if (reason.message === HttpErrorType.FORBIDDEN) {
                    logErrorMessage(reason.message, reason.navCallId);
                    dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                    dispatch(skalViseForbudtside(true));
                } else {
                    logErrorMessage(reason.message);
                    dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                    dispatch(skalViseFeilside(true));
                }
            });
    };
}

export function hentSaksdata(sti: InnsynsdataSti, visFeilSide?: boolean) {
    return (dispatch: Dispatch) => {
        dispatch(settRestStatus(sti, REST_STATUS.PENDING));
        let url = "/innsyn/" + sti;
        fetchToJson(url)
            .then((response: any) => {
                dispatch(oppdaterInnsynsdataState(sti, response));
                dispatch(settRestStatus(sti, REST_STATUS.OK));
            })
            .catch((reason) => {
                if (reason.message === HttpErrorType.UNAUTHORIZED) {
                    dispatch(settRestStatus(sti, REST_STATUS.UNAUTHORIZED));
                } else if (reason.message === HttpErrorType.SERVICE_UNAVAILABLE) {
                    dispatch(settRestStatus(sti, REST_STATUS.SERVICE_UNAVAILABLE));
                } else if (reason.message === HttpErrorType.FORBIDDEN) {
                    logErrorMessage(reason.message, reason.navCallId);
                    dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                    dispatch(skalViseForbudtside(true));
                } else {
                    logErrorMessage(reason.message, reason.navCallId);
                    dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                    if (visFeilSide !== false) {
                        dispatch(skalViseFeilside(true));
                    }
                }
            });
    };
}

export function hentSaksdetaljer(fiksDigisosId: string, visFeilSide?: boolean) {
    return (dispatch: Dispatch) => {
        dispatch(oppdaterSaksdetaljerRestStatus(fiksDigisosId, REST_STATUS.PENDING));
        let url = "/innsyn/saksDetaljer?id=" + fiksDigisosId;
        fetchToJson(url)
            .then((response: any) => {
                dispatch(oppdaterSaksdetaljerState(fiksDigisosId, response));
            })
            .catch((reason) => {
                if (reason.message === HttpErrorType.UNAUTHORIZED) {
                    dispatch(oppdaterSaksdetaljerRestStatus(fiksDigisosId, REST_STATUS.UNAUTHORIZED));
                } else if (reason.message === HttpErrorType.FORBIDDEN) {
                    logErrorMessage(reason.message, reason.navCallId);
                    dispatch(oppdaterSaksdetaljerRestStatus(fiksDigisosId, REST_STATUS.FEILET));
                    dispatch(skalViseForbudtside(true));
                } else {
                    logErrorMessage(reason.message, reason.navCallId);
                    dispatch(oppdaterSaksdetaljerRestStatus(fiksDigisosId, REST_STATUS.FEILET));
                    if (visFeilSide !== false) {
                        dispatch(skalViseFeilside(true));
                    }
                }
            });
    };
}

export const setOppgaveVedleggopplastingFeilet = (status: boolean) => ({
    type: InnsynsdataActionTypeKeys.OPPGAVE_VEDLEGSOPPLASTING_FEILET,
    status: status,
});

export const setOppgaveOpplastingFeilet = (oppgaveId: string, status: boolean) => ({
    type: InnsynsdataActionTypeKeys.OPPGAVE_OPPLASTING_FEILET,
    oppgaveId,
    status,
});

export const setOppgaveOpplastingFeiletPaBackend = (oppgaveId: string, status: boolean) => ({
    type: InnsynsdataActionTypeKeys.OPPGAVE_OPPLASTING_BACKEND_FEILET,
    oppgaveId,
    status,
});

export const setOppgaveOpplastingFeiletVirussjekkPaBackend = (oppgaveId: string, status: boolean) => ({
    type: InnsynsdataActionTypeKeys.OPPGAVE_OPPLASTING_BACKEND_FEILET_PGA_VIRUS,
    oppgaveId,
    status,
});
