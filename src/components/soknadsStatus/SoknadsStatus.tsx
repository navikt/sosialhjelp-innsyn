import React from 'react';
import { Panel } from "nav-frontend-paneler";
import { Innholdstittel } from "nav-frontend-typografi";
import DokumentSendt from "../ikoner/DokumentSendt";

const SoknadsStatus: React.FC = () => {
	return (
		<Panel className="panel-uthevet">
			<Innholdstittel>Søknaden er sendt</Innholdstittel>
			<DokumentSendt />
		</Panel>
	);
};

export default SoknadsStatus;
