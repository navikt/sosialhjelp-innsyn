import {Reducer} from "redux";
import {setPath} from "../../utils/setPath";
import {REST_STATUS} from "../../utils/restUtils";

enum Utfall {
    INNVILGET = "INNVILGET",
    DELVIS_INNVILGET = "DELVIS_INNVILGET",
    AVSLATT = "AVSLATT",
    AVVIST = "AVVIST"
}

interface SaksStatusState {
    tittel: string;
    status: Utfall;
    vedtaksfilUrlList: string[];
}

interface Oppgave {
    innsendelsesfrist: string;
    dokumenttype: string;
    tilleggsinformasjon: string;
}

export enum InnsynsdataActionTypeKeys {
    OPPDATER_INNSYNSSDATA = "innsynsdata/OPPDATER",
    OPPDATER_INNSYNSSDATA_STI = "innsynsdata/OPPDATER_STI",
    SETT_REST_STATUS = "innsynsdata/SETT_REST_STATUS"
}

export enum InnsynsdataSti {
    SAKSSTATUS = "saksStatus",
    OPPGAVER = "oppgaver",
    SOKNADS_STATUS = "soknadsStatus",
    HENDELSER = "hendelser"
}

export interface InnsynssdataActionVerdi {
    saksStatus?: SaksStatusState;
}

export interface InnsynsdataActionType {
    type: InnsynsdataActionTypeKeys,
    verdi?: InnsynssdataActionVerdi,
    sti: InnsynsdataSti,
    restStatus?: string
}

export interface InnsynsdataType {
    saksStatus: SaksStatusState[];
    oppgaver: Oppgave[];
    restStatus: any;
}

const initialInnsynsdataRestStatus = {
    saksStatus: REST_STATUS.INITIALISERT,
    oppgaver: REST_STATUS.INITIALISERT
};

const initialState: InnsynsdataType = {
    saksStatus: [],
    oppgaver: [],
    restStatus: initialInnsynsdataRestStatus
};

const InnsynsdataReducer: Reducer<InnsynsdataType, InnsynsdataActionType> = (state = initialState, action) => {
    switch (action.type) {
        case InnsynsdataActionTypeKeys.OPPDATER_INNSYNSSDATA_STI:
            return {
                ...setPath(state, action.sti, action.verdi)
            };
        case InnsynsdataActionTypeKeys.SETT_REST_STATUS:
            return {
                ...setPath(state, "restStatus/" + action.sti, action.restStatus)
            };
        default:
            return state;
    }
};

export const oppdaterInnsynsdataState = (sti: InnsynsdataSti, verdi: InnsynssdataActionVerdi): InnsynsdataActionType => {
    return {
        type: InnsynsdataActionTypeKeys.OPPDATER_INNSYNSSDATA_STI,
        sti,
        verdi
    }
};

export const settRestStatus = (sti: InnsynsdataSti, restStatus: REST_STATUS): InnsynsdataActionType => {
    return {
        type: InnsynsdataActionTypeKeys.SETT_REST_STATUS,
        sti,
        restStatus
    }
};


export default InnsynsdataReducer;
