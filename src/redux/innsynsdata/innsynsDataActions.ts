import {Dispatch} from "redux";
import {fetchToJson, HttpStatus, REST_STATUS} from "../../utils/restUtils";
import {
    InnsynsdataSti,
    oppdaterInnsynsdataState,
    oppdaterSaksdetaljerRestStatus,
    oppdaterSaksdetaljerState,
    settRestStatus
} from "./innsynsdataReducer";
import {history} from "../../configureStore";

export const innsynsdataUrl = (fiksDigisosId: string, sti: string): string => `/innsyn/${fiksDigisosId}/${sti}`;

export function hentInnsynsdata(fiksDigisosId: string|string, sti: InnsynsdataSti, visFeilSide?: boolean) {
    return (dispatch: Dispatch) => {
        dispatch(settRestStatus(sti, REST_STATUS.PENDING));
        let url = innsynsdataUrl(fiksDigisosId, sti);
        fetchToJson(url).then((response: any) => {
            dispatch(oppdaterInnsynsdataState(sti, response));
            dispatch(settRestStatus(sti, REST_STATUS.OK));
        }).catch((reason) => {
            if (reason.message === HttpStatus.UNAUTHORIZED) {
                dispatch(settRestStatus(sti, REST_STATUS.UNAUTHORIZED));
            } else {
                dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                // history.push("/innsyn/feil");
            }
        });
    }
}

export function hentSaksdata(sti: InnsynsdataSti, visFeilSide?: boolean) {
    return (dispatch: Dispatch) => {
        dispatch(settRestStatus(sti, REST_STATUS.PENDING));
        let url = "/digisosapi/" + sti;
        fetchToJson(url).then((response: any) => {
            dispatch(oppdaterInnsynsdataState(sti, response));
            dispatch(settRestStatus(sti, REST_STATUS.OK));
        }).catch((reason) => {
            if (reason.message === HttpStatus.UNAUTHORIZED) {
                dispatch(settRestStatus(sti, REST_STATUS.UNAUTHORIZED));
            } else {
                dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                if (visFeilSide !== false) {
                    // history.push("/innsyn/feil");
                }
            }
       });
    }
}

export function hentSaksdetaljer(fiksDigisosId: string, visFeilSide?: boolean) {
    return (dispatch: Dispatch) => {
        dispatch(oppdaterSaksdetaljerRestStatus(fiksDigisosId, REST_STATUS.PENDING));
        let url = "/digisosapi/saksDetaljer?id=" + fiksDigisosId;
        fetchToJson(url).then((response: any) => {
            dispatch(oppdaterSaksdetaljerState(fiksDigisosId, response));
        }).catch((reason) => {
            if (reason.message === HttpStatus.UNAUTHORIZED) {
                dispatch(oppdaterSaksdetaljerRestStatus(fiksDigisosId, REST_STATUS.UNAUTHORIZED));
            } else {
                dispatch(oppdaterSaksdetaljerRestStatus(fiksDigisosId, REST_STATUS.FEILET));
                if (visFeilSide !== false) {
                    // history.push("/innsyn/feil");
                }
            }
        });
    }
}