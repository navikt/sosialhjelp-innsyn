import React from 'react';
import { Panel } from "nav-frontend-paneler";
import { Innholdstittel } from "nav-frontend-typografi";
import DokumentSendt from "../ikoner/DokumentSendt";
import DokumentMottatt from "../ikoner/DokumentMottatt";

export enum SoknadsStatusEnum {
	SENDT = "soknadsstatus/sendt",
	MOTTATT = "soknadsstatus/mottattt"
}

interface Props {
	status: SoknadsStatusEnum;
}

const SoknadsStatus: React.FC<Props> = ({status}) => {
	return (
		<Panel className="panel-uthevet">
			{status === SoknadsStatusEnum.SENDT && (
				<>
					<Innholdstittel>Søknaden er sendt</Innholdstittel>
					<DokumentSendt />
				</>
			)}
			{status === SoknadsStatusEnum.MOTTATT && (
				<>
					<Innholdstittel>Søknaden er mottatt</Innholdstittel>
					<DokumentMottatt />
				</>
			)}
		</Panel>
	);
};

export default SoknadsStatus;
