import {useEffect, useState} from "react";
import {fetchToJson, REST_STATUS} from "../../utils/restUtils";
import {ServiceHookTypes} from "../../utils/ServiceHookTypes";

export interface UtbetalingType {
    tittel: string;
    belop: number;
    utbetalingsdato: string;
    vilkar: any[]; // TODO Finn testdata for vilkår
    dokumentasjonkrav: any[]; // TODO Finn testdata for dok.krav.
}

export interface UtbetalingMaaned {
   tittel: string,
   utbetalinger: UtbetalingType[],
   belop: number;
}

export interface UtbetalingSakType {
    fiksDigisosId: string;
    utbetalinger: UtbetalingMaaned[];
}

const useUtbetalingerService = () => {
    const [result, setResult] = useState<ServiceHookTypes<UtbetalingSakType[]>>({
        restStatus: REST_STATUS.PENDING
    });

    let url = "/innsyn/utbetalinger";

    useEffect(() => {
        fetchToJson(url)
            .then((response: any) => {
                setResult({ restStatus: REST_STATUS.OK, payload: response });
            })
            .catch((error: any) => {
                setResult({ restStatus: REST_STATUS.FEILET, error })
            });
    }, [url]);
    return result;
};

export default useUtbetalingerService;
