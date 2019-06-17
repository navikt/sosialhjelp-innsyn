import React from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import './App.less';
import AppBanner from "./components/appBanner/AppBanner";
import BrodsmuleSti from "./components/brodsmuleSti/BrodsmuleSti";

const App: React.FC = () => {
	return (
		<div className="informasjon-side">
			<AppBanner/>

			<div className="blokk-center">
				<BrodsmuleSti/>
				<Lenkepanel href="#todo" tittelProps="normaltekst" border>
					Lenkepanel test
				</Lenkepanel>

				<Lesmerpanel intro={<span>Les mer panel med introduksjonstekst her som <a href="todo#">kan være HTML</a></span>} border>
					<div>
						<p style={{"marginTop": 0}}>
							Noe tekst som økonomisk sosialhjelp. Du bestemmer selv om du vil bruke sykmeldingen eller avbryte den. Du kan også jobbe i kombinasjon med sykmelding. Det kommer an på hva sykdommen din tillater og hva det er praktisk mulig å få til på arbeidsplassen.
						</p>
						<p>
							Greit å vite: Arbeidsgiveren har plikt til å legge til rette for at du kan jobbe helt eller delvis selv om du er syk.
						</p>
					</div>
				</Lesmerpanel>

				<p style={{textAlign: "center"}}>
					<img src="ella_blunk.svg" className="App-logo" alt="logo"/>
				</p>

			</div>
		</div>
	);
};

export default App;
