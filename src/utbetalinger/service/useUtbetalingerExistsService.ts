import {useEffect, useState} from "react";
import {fetchToJson, REST_STATUS} from "../../utils/restUtils";
import {ServiceHookTypes} from "../../utils/ServiceHookTypes";
import {logWarningMessage} from "../../redux/innsynsdata/loggActions";

const useUtbetalingerExistsService = (month: number) => {
    const [result, setResult] = useState<ServiceHookTypes<boolean>>({
        restStatus: REST_STATUS.PENDING,
    });

    useEffect(() => {
        const url = "/innsyn/utbetalinger/exists";
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

export default useUtbetalingerExistsService;
