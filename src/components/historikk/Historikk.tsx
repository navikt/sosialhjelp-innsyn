import React from 'react';
import { Panel } from "nav-frontend-paneler";
import { Systemtittel } from "nav-frontend-typografi";

const Historikk: React.FC = () => {
	return (<>
			<Panel className="panel-luft-over">
				<Systemtittel>Historikk</Systemtittel>
			</Panel>
			<Panel className="panel-glippe-over">
				<b>19.06.2019 klokken 17:56</b>
				<br/>
				Søknaden med vedlegg er sendt til NAV Sagene, Oslo kommune
			</Panel>
		</>
	);
};

export default Historikk;
