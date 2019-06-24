import React from 'react';
import { Panel } from "nav-frontend-paneler";
import { Systemtittel } from "nav-frontend-typografi";
import LenkepanelBase from "nav-frontend-lenkepanel/lib/Lenkepanel-base";
import PaperClip from "../components/ikoner/PaperClip";
import Coins from "../components/ikoner/Coins";
import Historikk from "../components/historikk/Historikk";
import SoknadsStatus from "../components/soknadsStatus/SoknadsStatus";

const SendtSoknad: React.FC = () => {
	return (
		<>
			<SoknadsStatus />

			{/*Oppgaver*/}
			<Panel className="panel-luft-over">
				<Systemtittel>Dine oppgaver</Systemtittel>
			</Panel>
			<Panel className="panel-glippe-over">
				Du har ingen oppgaver. Du vil få beskjed hvis det er noe du må gjøre.
			</Panel>

			{/*Lenke*/}
			<div className="panel-luft-over panel-ikon-grupppe">
				<LenkepanelBase href="#todo" className="panel-ikon">

					<div className="panel-ikon-boks">
						<PaperClip/>
					</div>
					<span className="panel-ikon-tekst">
							Vedlegg (0)
					</span>
				</LenkepanelBase>

				<LenkepanelBase href="#todo" className="panel-uthevet-ikon">

					<div className="panel-ikon-boks">
						<Coins/>
					</div>

					<span className="panel-ikon-tekst">
							Utbetalinger (0)
						</span>
				</LenkepanelBase>
			</div>

			<Historikk/>

		</>
	);
};

export default SendtSoknad;
