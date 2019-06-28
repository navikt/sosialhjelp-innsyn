import React from 'react';
import { Panel } from "nav-frontend-paneler";
import {Element, EtikettLiten, Innholdstittel} from "nav-frontend-typografi";
import DokumentSendt from "../ikoner/DokumentSendt";
import DokumentMottatt from "../ikoner/DokumentMottatt";
import DokumentElla from "../ikoner/DocumentElla";
import "./soknadsStatus.less";
import Lenke from "nav-frontend-lenker";

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
				<Element>Nødhjelp</Element>
				<div className="status_detalj_panel__status">
					<EtikettLiten>innvilget</EtikettLiten>
				</div>
				<div className="status_detalj_panel__kommentarer">
					<Lenke href="todo">Vedtakstbrev (12.03.2019)</Lenke>
				</div>
			</div>

			<div className="status_detalj_panel">
				<Element>Livsopphold og husleie</Element>
				<div className="status_detalj_panel__status">
					<EtikettLiten>under behandling</EtikettLiten>
				</div>
			</div>

		</Panel>
	);
};

export default SoknadsStatus;
