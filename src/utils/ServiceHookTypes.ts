import {REST_STATUS} from "./restUtils";

interface ServiceInit {
    restStatus: REST_STATUS.INITIALISERT;
}

interface ServiceLoading {
    restStatus: REST_STATUS.PENDING;
}

interface ServiceLoaded<T> {
    restStatus: REST_STATUS.OK;
    payload: T;
}

interface ServiceError {
    restStatus: REST_STATUS.FEILET;
    error: Error;
}

export type ServiceHookTypes<T> = ServiceInit | ServiceLoading | ServiceLoaded<T> | ServiceError;

export const erDevMiljo = (): boolean => {
    const url = window.location.href;
    return url.indexOf("localhost:3000") > 0;
};
