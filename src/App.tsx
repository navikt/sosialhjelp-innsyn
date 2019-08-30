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

const store = configureStore();

const App: React.FC = () => {
	const language = "nb";
	return (
		<Provider store={store}>
			<IntlProvider defaultLocale={language} locale={language} messages={tekster[language]}>
				<ConnectedRouter history={history}>
					<Switch>
						<Route exact path="/" component={SaksoversiktRouter} />
						<Route path="/saksoversikt" component={SaksoversiktRouter} />
						<Route path="/innsyn" component={InnsynRouter} />
					</Switch>
				</ConnectedRouter>
			</IntlProvider>
		</Provider>
	);
};

export default App;
