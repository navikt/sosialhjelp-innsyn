import {createBrowserHistory} from "history";
import {applyMiddleware, compose, createStore} from "redux";
import {routerMiddleware} from "connected-react-router";
import reducers from "./rootReducer";
import thunkMiddleware from "redux-thunk";
import {isDev} from "./utils/restUtils";

/**
 * Resolves basename in a pathname independent way
 */
export function getAbsoluteBasename() {
    // @ts-ignore
    // return erDev() ? "sosialhjelp/innsyn" : window.location.pathname.replace(/^\/(([^/]+\/)?sosialhjelp\/innsyn).+$/, "$1");
    return isDev(window.location.origin)
        ? "sosialhjelp"
        : window.location.pathname.replace(/^\/(([^/]+\/)?sosialhjelp).+$/, "$1");
}

export const history = createBrowserHistory({
    basename: getAbsoluteBasename(),
});

export default function configureStore() {
    const w: any = window as any;
    const devtools: any = w.__REDUX_DEVTOOLS_EXTENSION__ ? w.__REDUX_DEVTOOLS_EXTENSION__() : (f: any) => f;

    const store = createStore(
        reducers(history),
        compose(applyMiddleware(routerMiddleware(history), thunkMiddleware), devtools)
    );
    return store;
}
