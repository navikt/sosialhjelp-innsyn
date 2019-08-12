import React from 'react';
import { Panel } from "nav-frontend-paneler";
import {Element, EtikettLiten, Innholdstittel} from "nav-frontend-typografi";
import DokumentSendt from "../ikoner/DokumentSendt";
import DokumentMottatt from "../ikoner/DokumentMottatt";
import DokumentElla from "../ikoner/DocumentElla";
import "./soknadsStatus.less";
import {SaksStatusState} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import {FormattedMessage} from "react-intl";
import Lastestriper from "../lastestriper/Lasterstriper";

export enum SoknadsStatusEnum {
	SENDT = "SENDT",
	MOTTATT = "MOTTATT",
	UNDER_BEHANDLING = "UNDER_BEHANDLING",
}

interface StatusDetalj {
	beskrivelse: string;
	status: string;
	kommentarer?: React.ReactNode|string;
}

interface Props {
	status: string|null|SoknadsStatusEnum;
	saksStatus?: null|SaksStatusState[];
	leserData: boolean;
}

const SoknadsStatus: React.FC<Props> = ({status, saksStatus, leserData}) => {
	return (
		<Panel className="panel-uthevet">
			<div className="tittel_og_ikon">
				{leserData && (
					<Lastestriper linjer={1}/>
				)}
				{status === SoknadsStatusEnum.SENDT && (
					<>
						<Innholdstittel><FormattedMessage id="status.sendt" /></Innholdstittel>
						<DokumentSendt />
					</>
				)}
				{status === SoknadsStatusEnum.MOTTATT && (
					<>
						<Innholdstittel><FormattedMessage id="status.mottatt" /></Innholdstittel>
						<DokumentMottatt />
					</>
				)}
				{status === SoknadsStatusEnum.UNDER_BEHANDLING && (
					<>
						<Innholdstittel><FormattedMessage id="status.under_behandling" /></Innholdstittel>
						<DokumentElla />
					</>
				)}
			</div>

			{saksStatus && saksStatus.map((statusdetalj: SaksStatusState, index: number) => {
				const status = statusdetalj.status.replace(/_/,' ');
				return (
					<div className="status_detalj_panel" key={index}>
						<Element>{statusdetalj.tittel}</Element>
						<div className="status_detalj_panel__status">
							<EtikettLiten>{status}</EtikettLiten>
						</div>
						{statusdetalj.vedtaksfilUrlList && statusdetalj.vedtaksfilUrlList.map((filnavn: string, index: number) => (
							<div className="status_detalj_panel__kommentarer" key={index}>
								<EksternLenke href={"todo_url_" + filnavn}>Vedtaksbrev</EksternLenke>
							</div>
						))}
					</div>
				)
			})}

		</Panel>
	);
};

export default SoknadsStatus;
