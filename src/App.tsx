import React from 'react';
import './App.less';
import AppBanner from "./components/appBanner/AppBanner";
import BrodsmuleSti from "./components/brodsmuleSti/BrodsmuleSti";
import SendtSoknad from "./pages/SendtSoknad";
import { ConnectedRouter } from "connected-react-router";
import configureStore, {getAbsoluteBasename, history} from "./configureStore";
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
import {getApiBaseUrlForSwagger} from "./utils/restUtils";
import {Panel} from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst, Sidetittel} from "nav-frontend-typografi";

addLocaleData(nbLocaleData);

const store = configureStore();

const Meny: React.FC = () => {

	return (
		<Panel>
			<Sidetittel>Sosialhjelp innsyn</Sidetittel>
			<Normaltekst>
				<p>
					Her er det mulig å test innsyn for sosialsøkere.
				</p>
				<ul>
					<li><a href={"/" + getAbsoluteBasename() + "/status"}>Status på sak</a> Dataene er default-response mock data fra bakcend.</li>
					<li><a href={"/" + getAbsoluteBasename() + "/debug"}>Alle data som JSON</a></li>
				</ul>
			</Normaltekst>
			<Innholdstittel>Swagger grensesnitt</Innholdstittel>
			<Normaltekst>
				<p>Man kan bruke swaggersidene å laste opp testdata og vise testdataene i innsynssidene slik:</p>
				<ol>
					<li>Gå til <a href={ getApiBaseUrlForSwagger() }>swagger</a></li>
					<li>Velg <b>mock-controller</b> og tilhørende POST-kall, og deretter <b>'Try it out'</b></li>
					<li>Lim inn dine testdata som jsonDigisosSoker (digisos-soker.json)</li>
					<li>Velg en 'soknadId' for dine testdata</li>
					<li>Gå til <a href={"/" + getAbsoluteBasename() + "/soknadId/status"}>status-siden</a></li>
					<li>Endre 'soknadId' i url til å matche din soknadId fra steg 4 for å se innsynsvisningen med dine testdata</li>
				</ol>
			</Normaltekst>
			<Innholdstittel>Mockede statiske sider</Innholdstittel>
			<Normaltekst>
				<p>
					Forhåndsvisning av sider under arbeid med statiske mockdata.
				</p>
				<ul>
					<li><a href={"/" + getAbsoluteBasename() + "/sendt"}>Sendt søknad</a></li>
					<li><a href={"/" + getAbsoluteBasename() + "/mottatt"}>Mottatt søknad</a></li>
					<li><a href={"/" + getAbsoluteBasename() + "/behandling"}>Under behandling</a></li>
					<li><a href={"/" + getAbsoluteBasename() + "/vedlegg"}>Vedlegg</a></li>
					<li><a href={"/" + getAbsoluteBasename() + "/oppgaver"}>Oppgaver</a></li>
				</ul>
			</Normaltekst>
		</Panel>
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
								<Route exact path="/:soknadId/status" component={SaksStatus} />
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
