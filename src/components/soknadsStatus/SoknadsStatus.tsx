import React from 'react';
import { Panel } from "nav-frontend-paneler";
import {Element, EtikettLiten, Innholdstittel} from "nav-frontend-typografi";
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
	kommentarer?: React.ReactNode|string;
}

interface Props {
	status: SoknadsStatusEnum;
	statusdetaljer?: StatusDetalj[];
}

const SoknadsStatus: React.FC<Props> = ({status, statusdetaljer}) => {
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

			{statusdetaljer && statusdetaljer.map((statusdetalj: StatusDetalj, index: number) => {
				return (
					<div className="status_detalj_panel" key={index}>
						<Element>{statusdetalj.beskrivelse}</Element>
						<div className="status_detalj_panel__status">
							<EtikettLiten>{statusdetalj.status}</EtikettLiten>
						</div>
						{statusdetalj.kommentarer && (
							<div className="status_detalj_panel__kommentarer">
								{statusdetalj.kommentarer}
							</div>
						)}
					</div>
				)
			})}

		</Panel>
	);
};

export default SoknadsStatus;
