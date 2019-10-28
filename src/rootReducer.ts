import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'
import InnsynsdataReducer from "./redux/innsynsdata/innsynsdataReducer";
import NavigasjonsReducer from "./redux/navigasjon/navigasjonsReducer";

export default (history: any) => combineReducers({
	router: connectRouter(history),
	innsynsdata: InnsynsdataReducer,
	navigasjon: NavigasjonsReducer
});
