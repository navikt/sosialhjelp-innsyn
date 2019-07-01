import * as React from "react";
import "./brodsmuleSti.less";
import {Normaltekst} from "nav-frontend-typografi";

const BrodsmuleSti: React.FC<{}> = () => {
	return (
		<div className="brodsmulesti">
			<Normaltekst>
				<a href="#todo">Ditt NAV</a> / <a href="#todo">Dine søknader</a> / Søknad om økonomisk sosialhjelp
			</Normaltekst>
		</div>
	);
};

export default BrodsmuleSti;
