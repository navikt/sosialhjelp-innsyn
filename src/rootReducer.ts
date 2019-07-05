import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'
import InnsynsdataReducer from "./redux/innsynsdata/innsynsdataReducer";

export default (history: any) => combineReducers({
	router: connectRouter(history),
	innsynsdata: InnsynsdataReducer
});
