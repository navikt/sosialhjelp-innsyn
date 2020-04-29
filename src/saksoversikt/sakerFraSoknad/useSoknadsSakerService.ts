import {useEffect, useState} from "react";
import {ServiceHookTypes} from "../../utils/ServiceHookTypes";
import {fetchToJsonFromSoknadApi, REST_STATUS} from "../../utils/restUtils";
import {Sakstype} from "../../redux/innsynsdata/innsynsdataReducer";

export interface SakerFraSoknad {
    innsendteSoknader: Sakstype[];
}

export interface Saksliste {
    results: Sakstype[];
}

const useSoknadsSakerService = () => {
    const [result, setResult] = useState<ServiceHookTypes<Saksliste>>({
        restStatus: REST_STATUS.PENDING
    });

    const urlPath = "/soknadoversikt/soknader";
    useEffect(() => {
    fetchToJsonFromSoknadApi(urlPath)
        .then((response: any) => setResult({restStatus: REST_STATUS.OK, payload: {results: response}}))
        .catch(error => setResult({restStatus: REST_STATUS.FEILET, error}));
    }, [urlPath]);
    return result;
};

export default useSoknadsSakerService;
