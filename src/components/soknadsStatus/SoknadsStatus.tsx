import React from 'react';
import { Panel } from "nav-frontend-paneler";
import { Innholdstittel } from "nav-frontend-typografi";
import DokumentSendt from "../ikoner/DokumentSendt";
import DokumentMottatt from "../ikoner/DokumentMottatt";
import DokumentElla from "../ikoner/DocumentElla";
import "./soknadsStatus.less";

export enum SoknadsStatusEnum {
	SENDT = "soknadsstatus/sendt",
	MOTTATT = "soknadsstatus/mottattt",
	UNDER_BEHANDLING = "soknadsstatus/under_behandling",
}

interface StatusDetalj {
	beskrivelse: string;
	status: string;
	detaljer: string;
}

interface Props {
	status: SoknadsStatusEnum;
	detaljer?: StatusDetalj[];
}

const SoknadsStatus: React.FC<Props> = ({status}) => {
	return (
		<Panel className="panel-uthevet">
			<div className="tittel_og_ikon">
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
				{status === SoknadsStatusEnum.UNDER_BEHANDLING && (
					<>
						<Innholdstittel>Søknaden er under behandling</Innholdstittel>
						<DokumentElla />

					</>
				)}
			</div>

			<div className="status_detalj_panel">
				<b>Nødhjelp</b>
				<div className="status_detalj_panel__status">innvilget</div>
				<div className="status_detalj_panel__kommentarer">
					<a href="todo" className="extern_lenke">Vedtakstbrev (12.03.2019)</a>
				</div>
			</div>

			<div className="status_detalj_panel">
				<b>Livsopphold og husleie</b>
				<div className="status_detalj_panel__status">under behandling</div>
			</div>

		</Panel>
	);
};

export default SoknadsStatus;
