import {useEffect, useState} from "react";
import {Service} from "./Service";

export interface TilgjengeligeKommuner {
    results: string[];
}

const useTilgjengeligeKommunerService = () => {
    const [result, setResult] = useState<Service<TilgjengeligeKommuner>>({
        status: 'loading'
    });
    const url = "/sosialhjelp/soknad-api/informasjon/tilgjengelige_kommuner";
    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(response => setResult({ status: 'loaded', payload: response }))
            .catch(error => setResult({ status: 'error', error }));
    }, []);
    return result;
};

export default useTilgjengeligeKommunerService;
