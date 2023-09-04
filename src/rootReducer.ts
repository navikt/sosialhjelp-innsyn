import {combineReducers} from "redux";
import InnsynsdataReducer from "./redux/innsynsdata/innsynsdataReducer";
import NavigasjonsReducer from "./redux/navigasjon/navigasjonsReducer";

const rootReducer = () =>
    combineReducers({
        innsynsdata: InnsynsdataReducer,
        navigasjon: NavigasjonsReducer,
    });

export default rootReducer;
