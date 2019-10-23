import {useEffect, useState} from "react";
import {Service} from "./Service";
import {Suggestion} from "../navAutocomplete/NavAutcomplete";

export interface KommuneNummere {
    results: Suggestion[];
}

const useKommuneNrService = () => {
    const [result, setResult] = useState<Service<KommuneNummere>>({
        status: 'loading'
    });

    // TODO Bytt url!!
    const url = "https://www.nav.no/sosialhjelp/innsyn-api/api/veiviser/kommunenummer";
    // const url = "/sosialhjelp/innsyn-api/api/veiviser/kommunenummer";
    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(response => setResult({ status: 'loaded', payload: ekstraherKommuneNr(response) }))
            .catch(error => setResult({ status: 'error', error }));
    }, []);
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
