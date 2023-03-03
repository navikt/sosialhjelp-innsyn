import {applyMiddleware, compose, createStore} from "redux";
import reducers from "./rootReducer";
import thunkMiddleware from "redux-thunk";

export default function configureStore() {
    const w: any = window as any;
    const devtools: any = w.__REDUX_DEVTOOLS_EXTENSION__ ? w.__REDUX_DEVTOOLS_EXTENSION__() : (f: any) => f;

    const store = createStore(reducers(), compose(applyMiddleware(thunkMiddleware), devtools));
    return store;
}
