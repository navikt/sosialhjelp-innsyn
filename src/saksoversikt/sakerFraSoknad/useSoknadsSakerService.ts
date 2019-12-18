import {useEffect, useState} from "react";
import {ServiceHookTypes} from "../../utils/ServiceHookTypes";
import {erDev, REST_STATUS} from "../../utils/restUtils";
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

    let url = "/sosialhjelp/soknad-api/soknadoversikt/soknader";
    if(erDev()) {
        url = "http://localhost:8181" + url;
    }
    if (window.location.origin.indexOf(".dev-nav.no") >= 0) {
        url = "https://sosialhjelp-soknad-api.dev-nav.no" + url;
    }
    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(response => setResult({ restStatus: REST_STATUS.OK, payload: {results: response} }))
            .catch(error => setResult({ restStatus: REST_STATUS.FEILET, error }));
    }, [url]);
    return result;
};

export default useSoknadsSakerService;
