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
    oppdaterDokumentasjonkravState,
} from "./innsynsdataReducer";
import {logWarningMessage} from "./loggActions";

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
                    logWarningMessage(reason.message, reason.navCallId);
                    dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                    dispatch(skalViseForbudtside(true));
                } else {
                    logWarningMessage(reason.message + " " + url, reason.navCallId);
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
                    logWarningMessage(reason.message, reason.navCallId);
                    dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                    dispatch(skalViseForbudtside(true));
                } else {
                    logWarningMessage(reason.message);
                    dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                    dispatch(skalViseFeilside(true));
                }
            });
    };
}

export function hentDokumentasjonkravMedId(fiksDigisosId: string, sti: InnsynsdataSti, oppgaveId: string) {
    console.log("hentdokumnetasjonkrav", oppgaveId);
    return (dispatch: Dispatch) => {
        dispatch(settRestStatus(sti, REST_STATUS.PENDING));
        const url = `${innsynsdataUrl(fiksDigisosId, sti)}/${oppgaveId}`;
        fetchToJson(url)
            .then((response: any) => {
                dispatch(oppdaterDokumentasjonkravState(oppgaveId, response));
                dispatch(settRestStatus(sti, REST_STATUS.OK));
            })
            .catch((reason) => {
                if (reason.message === HttpErrorType.UNAUTHORIZED) {
                    dispatch(settRestStatus(sti, REST_STATUS.UNAUTHORIZED));
                } else if (reason.message === HttpErrorType.FORBIDDEN) {
                    logWarningMessage(reason.message, reason.navCallId);
                    dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                    dispatch(skalViseForbudtside(true));
                } else {
                    logWarningMessage(reason.message);
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
                    logWarningMessage(reason.message, reason.navCallId);
                    dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                    dispatch(skalViseForbudtside(true));
                } else {
                    logWarningMessage(reason.message, reason.navCallId);
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
                    logWarningMessage(reason.message, reason.navCallId);
                    dispatch(oppdaterSaksdetaljerRestStatus(fiksDigisosId, REST_STATUS.FEILET));
                    dispatch(skalViseForbudtside(true));
                } else {
                    logWarningMessage(reason.message, reason.navCallId);
                    dispatch(oppdaterSaksdetaljerRestStatus(fiksDigisosId, REST_STATUS.FEILET));
                    if (visFeilSide !== false) {
                        dispatch(skalViseFeilside(true));
                    }
                }
            });
    };
}

export const setFileAttachmentsUploadFailed = (status: boolean) => ({
    type: InnsynsdataActionTypeKeys.FILE_ATTACHMENTS_UPLOAD_FAILED,
    status: status,
});

export const setFileUploadFailed = (oppgaveId: string, status: boolean) => ({
    type: InnsynsdataActionTypeKeys.FILE_UPLOAD_FAILED,
    oppgaveId,
    status,
});

export const setFileUploadFailedInBackend = (oppgaveId: string, status: boolean) => ({
    type: InnsynsdataActionTypeKeys.FILE_UPLOAD_BACKEND_FAILED,
    oppgaveId,
    status,
});

export const setFileUploadFailedVirusCheckInBackend = (oppgaveId: string, status: boolean) => ({
    type: InnsynsdataActionTypeKeys.FILE_UPLOAD_BACKEND_FAILED_VIRUS_CHECK,
    oppgaveId,
    status,
});
