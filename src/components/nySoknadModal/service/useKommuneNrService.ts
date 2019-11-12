import {useEffect, useState} from "react";
import {erDevMiljo, REST_STATUS, ServiceHookTypes} from "./ServiceHookTypes";

export interface Suggestion {
    key: string;
    value: string;
}

export interface KommuneNummere {
    results: Suggestion[];
}

const useKommuneNrService = () => {
    const [result, setResult] = useState<ServiceHookTypes<KommuneNummere>>({
        restStatus: REST_STATUS.PENDING
    });

    let url = "/sosialhjelp/innsyn-api/api/veiviser/kommunenummer";
    if (erDevMiljo()) {
        url = "http://localhost:8080/sosialhjelp/innsyn-api/api/veiviser/kommunenummer";
    }
    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(response => setResult({ restStatus: REST_STATUS.OK, payload: ekstraherKommuneNr(response) }))
            .catch(error => setResult({ restStatus: REST_STATUS.FEILET, error }));
    }, [url]);
    return result;
};

const ekstraherKommuneNr = (result: any): KommuneNummere => {
    const CONTAINED_ITEMS = "containeditems";
    const DESCRIPTION = "description";
    const LABEL = "label";
    const STATUS = "status";
    const kommuner: any[] = [];
    const responseData = result[CONTAINED_ITEMS].filter((item: any) => item[STATUS] === "Gyldig");
    responseData.map((item: any) => {
        return kommuner.push({
            key: item[LABEL],
            value: item[DESCRIPTION]
        });
    });
    kommuner.sort((a: Suggestion, b: Suggestion) => {
        if (a.value > b.value) {
            return 1;
        } else if (a.value < b.value) {
            return -1;
        } else {
            return 0;
        }
    });
    return {results: kommuner};
};

export default useKommuneNrService;
