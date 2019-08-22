import {Dispatch} from "redux";
import {fetchToJson, REST_STATUS} from "../../utils/restUtils";
import {
    InnsynsdataSti,
    oppdaterInnsynsdataState, settRestStatus
} from "./innsynsdataReducer";

export const innsynssdataUrl = (fiksDigisosId: string, sti: string): string => `/${fiksDigisosId}/${sti}`;

export function hentInnsynsdata(fiksDigisosId: string, sti: InnsynsdataSti) {
    return (dispatch: Dispatch) => {
        dispatch(settRestStatus(sti, REST_STATUS.PENDING));
        const url = innsynssdataUrl(fiksDigisosId, sti);
        fetchToJson(url).then((response: any) => {
            dispatch(oppdaterInnsynsdataState(sti, response));
            dispatch(settRestStatus(sti, REST_STATUS.OK));
        }).catch((reason) => {
            dispatch(settRestStatus(sti, REST_STATUS.FEILET));
            // TODO redirigerTilFeilside()
            // TODO Logg feil
        });
    }
}
