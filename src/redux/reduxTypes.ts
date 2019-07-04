import {InnsynsdataType} from "./innsynsdata/innsynsdataReducer";

type Dispatch = (action: any) => Promise<any>;

export interface DispatchProps {
    dispatch: Dispatch;
}

export interface InnsynAppState {
    innsynsdata: InnsynsdataType;
}
