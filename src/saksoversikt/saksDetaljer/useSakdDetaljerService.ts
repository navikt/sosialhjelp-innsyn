import {useEffect, useState} from "react";
import {ServiceHookTypes} from "../../utils/ServiceHookTypes";
import {fetchToJson, REST_STATUS} from "../../utils/restUtils";
import {Sakstype} from "../../redux/innsynsdata/innsynsdataReducer";

export interface Saksliste {
    results: Sakstype[];
}

const useSakdDetaljerService = (saksListe:string[]) => {
    const [result, setResult] = useState<ServiceHookTypes<Saksliste>>({
        restStatus: REST_STATUS.PENDING
    });

    let url = "/digisosapi/saksDetaljer?ids=" + saksListe;

    useEffect(() => {
        fetchToJson(url).then((response: any) => {
            setResult({ restStatus: REST_STATUS.OK, payload: {results: response} });
        }).catch((reason) => {
            setResult({restStatus: REST_STATUS.FEILET, error: reason});
        });
    }, [url]);
    return result;
};

export default useSakdDetaljerService;
