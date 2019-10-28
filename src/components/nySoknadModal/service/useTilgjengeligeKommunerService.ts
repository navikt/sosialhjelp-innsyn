import {useEffect, useState} from "react";
import {erDevMiljo, ServiceHookTypes} from "./ServiceHookTypes";
import {REST_STATUS} from "../../../utils/restUtils";

export interface KommuneTilgjengelighet {
    harMidlertidigDeaktivertMottak: boolean;
    harMidlertidigDeaktivertOppdateringer: boolean;
    kanMottaSoknader: boolean;
    kanOppdatereStatus: boolean;
    kommunenummer: string;
}

export interface TilgjengeligeKommuner {
    results: KommuneTilgjengelighet[];
}

const useTilgjengeligeKommunerService = () => {
    const [result, setResult] = useState<ServiceHookTypes<TilgjengeligeKommuner>>({
        restStatus: REST_STATUS.PENDING
    });

    let url = "/sosialhjelp/innsyn-api/api/v1/innsyn/kommune";
    if (erDevMiljo()) {
        url = "http://localhost:8080/sosialhjelp/innsyn-api/api/v1/innsyn/kommune";
    }

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(response => setResult({ restStatus: REST_STATUS.OK, payload: {results: response} }))
            .catch(error => setResult({ restStatus: REST_STATUS.FEILET, error }));
    }, [url]);
    return result;
};

const finnTilgjengeligKommune = (kommuneTilgjengelighet: KommuneTilgjengelighet[], kommunenummer: string): KommuneTilgjengelighet|undefined => {
    return kommuneTilgjengelighet.find((kommune: KommuneTilgjengelighet) =>  kommune.kommunenummer.match(kommunenummer));
};

export {finnTilgjengeligKommune};
export default useTilgjengeligeKommunerService;
