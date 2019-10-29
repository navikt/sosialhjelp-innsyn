import {Dispatch} from "redux";
import {fetchToJson, HttpStatus, REST_STATUS} from "../../utils/restUtils";
import {InnsynsdataSti, oppdaterInnsynsdataState, settRestStatus} from "./innsynsdataReducer";
import {history} from "../../configureStore";

export const innsynssdataUrl = (fiksDigisosId: string, sti: string): string => `/${fiksDigisosId}/${sti}`;

export function hentInnsynsdata(fiksDigisosId: string|string, sti: InnsynsdataSti, visFeilSide?: boolean) {
    return (dispatch: Dispatch) => {
        dispatch(settRestStatus(sti, REST_STATUS.PENDING));
        let url = "/innsyn" + innsynssdataUrl(fiksDigisosId, sti);
        fetchToJson(url).then((response: any) => {
            dispatch(oppdaterInnsynsdataState(sti, response));
            dispatch(settRestStatus(sti, REST_STATUS.OK));
        }).catch((reason) => {
            if (reason.message === HttpStatus.UNAUTHORIZED) {
                dispatch(settRestStatus(sti, REST_STATUS.UNAUTHORIZED));
            } else {
                dispatch(settRestStatus(sti, REST_STATUS.FEILET));
                history.push("/feil");
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
                    history.push("feil");
                }
            }
       });
    }
}
