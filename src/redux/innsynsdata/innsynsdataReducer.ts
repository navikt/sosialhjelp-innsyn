import {Reducer} from "redux";

export enum Feilside {
    TEKNISKE_PROBLEMER = "TEKNISKE_PROBLEMER",
    IKKE_TILGANG = "IKKE_TILGANG",
    FINNES_IKKE = "FINNES_IKKE",
}

export enum InnsynsdataActionTypeKeys {
    // Innsynsdata:
    VIS_FEILSIDE = "innsynsdata/VIS_FEILSIDE",
    SETT_FORNAVN = "innsynsdata/SETT_FORNAVN",
}

export interface InnsynsdataActionType {
    type: InnsynsdataActionTypeKeys;
    fornavn?: string;
    feilside?: Feilside;
}

export interface InnsynsdataType {
    fornavn?: string;
    feilside?: Feilside;
}

export const initialState: InnsynsdataType = {
    fornavn: "",
    feilside: undefined,
};

const InnsynsdataReducer: Reducer<InnsynsdataType, InnsynsdataActionType> = (state = initialState, action) => {
    switch (action.type) {
        case InnsynsdataActionTypeKeys.SETT_FORNAVN:
            return {
                ...state,
                fornavn: action.fornavn,
            };
        case InnsynsdataActionTypeKeys.VIS_FEILSIDE:
            return {
                ...state,
                feilside: action.feilside,
            };
        default:
            return state;
    }
};

export const visFeilside = (feilside?: Feilside) => {
    return {
        type: InnsynsdataActionTypeKeys.VIS_FEILSIDE,
        feilside,
    };
};

export default InnsynsdataReducer;
