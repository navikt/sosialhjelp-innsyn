import React from 'react';
import { ConnectedRouter } from "connected-react-router";
import configureStore, { history} from "./configureStore";
import { Provider } from "react-redux";
import {Route, Switch} from "react-router";
import {IntlProvider} from "react-intl";
import {tekster} from "./tekster/tekster";
import InnsynRouter from "./innsyn/InnsynRouter";
import './App.less';
import SaksoversiktRouter from "./saksoversikt/SaksoversiktRouter";
import VeiviserPlaceholder from "./saksoversikt/statiskeDemoSider/VeiviserPlaceholder";
import UtbetalingerRouter from "./utbetalinger/UtbetalingerRouter";
import Saksoversikt from "./saksoversikt/Saksoversikt";

const store = configureStore();

const visSpraakNokler = (tekster: any) => {
	if (window.location.href.match(/\\?vistekster=true$/)){
		Object.keys(tekster).map((key: string) => {
			return tekster[key] = tekster[key] + "[" + key + "]";
		});
	}
	return tekster;
};

const App: React.FC = () => {
	const language = "nb";
	return (
		<Provider store={store}>
			<IntlProvider defaultLocale={language} locale={language} messages={visSpraakNokler(tekster[language])}>
				<ConnectedRouter history={history}>
					<Switch>
						<Route exact path="/" component={VeiviserPlaceholder} />
						<Route path="/saksoversikt" component={SaksoversiktRouter} />
						<Route path="/innsyn/utbetalinger" component={UtbetalingerRouter} />
						<Route path="/innsyn/*" component={InnsynRouter} />
						<Route path="/innsyn" component={Saksoversikt} />
					</Switch>
				</ConnectedRouter>
			</IntlProvider>
		</Provider>
	);
};

export default App;
