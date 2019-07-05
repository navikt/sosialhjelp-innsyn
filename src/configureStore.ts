import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import reducers from './rootReducer';
import thunkMiddleware from 'redux-thunk'

export const history = createBrowserHistory({
	basename: "sosialhjelp"
});

export default function configureStore() {
	const w : any = window as any;
	const devtools: any = w.__REDUX_DEVTOOLS_EXTENSION__ ? w.__REDUX_DEVTOOLS_EXTENSION__() : (f:any)=>f;

	const store = createStore(
		reducers(history),
		compose(
			applyMiddleware(
				routerMiddleware(history),
				thunkMiddleware
			),
			devtools
		)
	);
	return store;
};
