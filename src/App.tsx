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
import DineOppgaver from "./pages/DineOppgaver";
import DebugSide from "./pages/DebugSide";
import {IntlProvider, addLocaleData} from "react-intl";
import nbLocaleData from 'react-intl/locale-data/nb';
import {tekster} from "./tekster/tekster";
import LangHistorikk from "./pages/LangHistorikk";

addLocaleData(nbLocaleData);

const store = configureStore();

const Meny: React.FC = () => {

	return (
		<>
			<h1>Dynamiske sider</h1>
			<ul>
				<li><a href={"/" + BASENAME + "/status"}>Status på sak</a></li>
				<li><a href={"/" + BASENAME + "/debug"}>Alle data som JSON</a></li>

			</ul>
			<h1>Mockede statiske sider</h1>
			<ul>
				<li><a href={"/" + BASENAME + "/sendt"}>Sendt søknad</a></li>
				<li><a href={"/" + BASENAME + "/mottatt"}>Mottatt søknad</a></li>
				<li><a href={"/" + BASENAME + "/behandling"}>Under behandling</a></li>
				<li><a href={"/" + BASENAME + "/vedlegg"}>Vedlegg</a></li>
				<li><a href={"/" + BASENAME + "/oppgaver"}>Oppgaver</a></li>
				<li><a href={"/" + BASENAME + "/historikk"}>Lang historikk</a></li>
			</ul>
		</>
	)
};



const App: React.FC = () => {
	const language = "nb";
	return (
		<Provider store={store}>
			<IntlProvider defaultLocale={language} locale={language} messages={tekster[language]}>
				<div className="informasjon-side">
					<AppBanner/>
					<ConnectedRouter history={history}>
						<div className="blokk-center">
							<BrodsmuleSti/>

							<Switch>
								<Route exact path="/" component={Meny} />
								<Route exact path="/status" component={SaksStatus} />
								<Route exact path="/debug" component={DebugSide} />
								<Route exact path="/sendt" component={SendtSoknad} />
								<Route exact path="/mottatt" component={MottattSoknad} />
								<Route exact path="/behandling" component={UnderBehandling} />
								<Route exact path="/vedlegg" component={DineVedlegg} />
								<Route exact path="/oppgaver" component={DineOppgaver} />
								<Route exact path="/historikk" component={LangHistorikk} />
							</Switch>

						</div>
					</ConnectedRouter>
				</div>
			</IntlProvider>
		</Provider>
	);
};

export default App;
