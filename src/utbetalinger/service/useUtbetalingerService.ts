import {useEffect, useState} from "react";
import {fetchToJson, REST_STATUS} from "../../utils/restUtils";
import {ServiceHookTypes} from "../../utils/ServiceHookTypes";
import {logWarningMessage} from "../../redux/innsynsdata/loggActions";

export interface UtbetalingType {
    tittel: string;
    belop: number;
    utbetalingsdato: string;
    vilkar: any[]; // TODO Finn testdata for vilkår
    dokumentasjonkrav: any[]; // TODO Finn testdata for dok.krav.
}

export interface UtbetalingSakType {
    ar: number;
    maned: string;
    sum: number;
    foersteIManeden: string;
    utbetalinger: UtbetalingMaaned[];
}

export interface UtbetalingMaaned {
    tittel: string;
    belop: number;
    utbetalingsdato: string;
    status: string;
    fiksDigisosId: string;
    fom: string | null;
    tom: string | null;
    mottaker: string;
    annenMottaker: boolean;
    kontonummer: string | null;
    forfallsdato: string | null;
    utbetalingsmetode: string | null;
}

const useUtbetalingerService = (month: number) => {
    const [result, setResult] = useState<ServiceHookTypes<UtbetalingSakType[]>>({
        restStatus: REST_STATUS.PENDING,
    });

    useEffect(() => {
        const url = "/innsyn/utbetalinger";
        setResult({restStatus: REST_STATUS.PENDING});
        fetchToJson(url + "?month=" + month)
            .then((response: any) => {
                setResult({restStatus: REST_STATUS.OK, payload: response});
            })
            .catch((error: any) => {
                logWarningMessage(error.message, error.navCallId);
                setResult({restStatus: REST_STATUS.FEILET, error});
            });
    }, [month]);
    return result;
};

export default useUtbetalingerService;
