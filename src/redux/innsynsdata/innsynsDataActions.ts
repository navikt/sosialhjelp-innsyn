import {Dispatch} from "redux";
import {fetchToJson, REST_STATUS} from "../../utils/restUtils";
import {
    InnsynsdataSti,
    oppdaterInnsynsdataState, settRestStatus
} from "./innsynsdataReducer";
import {history} from "../../configureStore";

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
            history.push("/feil");
        });
    }
}
//
// export function lastOppVedlegg(fiksDigisosId: string, formData: FormData) {
//     return (dispatch: Dispatch) => {
//         const sti = InnsynsdataSti.SEND_VEDLEGG;
//         dispatch(settRestStatus(sti, REST_STATUS.PENDING));
//         const url = innsynssdataUrl(fiksDigisosId, sti);
//         console.warn("==> url: " + url);
//         // const url = "http://localhost:8080/sosialhjelp/innsyn-api/api/v1/innsyn/1234/vedlegg/send";
//         fetch(url, {
//             method: 'POST',
//             body: formData,
//             headers: new Headers({
//                 "Authorization": "Bearer 1234",
//                 "Accept": "*/*"
//             })
//         }).then((response: Response) => {
//             dispatch(settRestStatus(sti, REST_STATUS.OK));
//             // dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.OPPGAVER));
//         }).catch((reason) => {
//             dispatch(settRestStatus(sti, REST_STATUS.FEILET));
//             history.push("/feil");
//         });
//     }
// }
