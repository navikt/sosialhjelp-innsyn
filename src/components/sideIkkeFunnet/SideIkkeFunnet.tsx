import * as React from "react";
import Feilside from "./feilside/Feilside";

const SideIkkeFunnet: React.StatelessComponent<{}> = () => {
	return (
		<Feilside>
			<p>Vi fant ikke siden du prøvde å åpne</p>
		</Feilside>
	);
};

export default SideIkkeFunnet;
