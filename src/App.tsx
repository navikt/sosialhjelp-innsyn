import React from 'react';
import './App.less';
import AppBanner from "./components/appBanner/AppBanner";
import BrodsmuleSti from "./components/brodsmuleSti/BrodsmuleSti";
import SendtSoknad from "./pages/SendtSoknad";
import { ConnectedRouter } from "connected-react-router";
import configureStore, {BASENAME, history} from "./configureStore";
import { Provider } from "react-redux";
import {Route, Switch} from "react-router";
import MottattSoknad from "./pages/MottattSoknad";
import UnderBehandling from "./pages/UnderBehandling";
import DineVedlegg from "./pages/DineVedlegg";
import SaksStatus from "./pages/SaksStatus";

const store = configureStore();

const Meny: React.FC = () => {

	return (
		<>
			<h1>Dynamiske sider</h1>
			<ul>
				<li><a href={"/" + BASENAME + "/status"}>Status på sak</a></li>
			</ul>
			<h1>Mockede statiske sider</h1>
			<ul>
				<li><a href={"/" + BASENAME + "/sendt"}>Sendt søknad</a></li>
				<li><a href={"/" + BASENAME + "/mottatt"}>Mottatt søknad</a></li>
				<li><a href={"/" + BASENAME + "/behandling"}>Under behandling</a></li>
				<li><a href={"/" + BASENAME + "/vedlegg"}>Vedlegg</a></li>
			</ul>
		</>
	)
};

const App: React.FC = () => {
	return (
		<Provider store={store}>
			<div className="informasjon-side">
				<AppBanner/>
				<ConnectedRouter history={history}>
					<div className="blokk-center">
						<BrodsmuleSti/>

						<Switch>
							<Route exact path="/" component={Meny} />
							<Route exact path="/sendt" component={SendtSoknad} />
							<Route exact path="/mottatt" component={MottattSoknad} />
							<Route exact path="/behandling" component={UnderBehandling} />
							<Route exact path="/vedlegg" component={DineVedlegg} />
							<Route exact path="/status" component={SaksStatus} />
						</Switch>

					</div>
				</ConnectedRouter>
			</div>
		</Provider>
	);
};

export default App;
