import React from 'react';
import {Panel} from "nav-frontend-paneler";
import {Element, EtikettLiten, Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import DokumentMottatt from "../ikoner/DokumentMottatt";
import DokumentElla from "../ikoner/DocumentElla";
import "./soknadsStatus.less";
import { SaksStatusState, Utfall, VedtakFattet} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import {FormattedMessage} from "react-intl";
import Lastestriper from "../lastestriper/Lasterstriper";
import DokumentOk from "../ikoner/DokumentOk";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import DokumentSendt from "../ikoner/DokumentSendt";

export enum SoknadsStatusEnum {
	SENDT = "SENDT",
	MOTTATT = "MOTTATT",
	UNDER_BEHANDLING = "UNDER_BEHANDLING",
	FERDIGBEHANDLET = "FERDIGBEHANDLET",
	BEHANDLES_IKKE = "BEHANDLES_IKKE"
}
export enum SaksStatusEnum {
	BEHANDLES_IKKE = "BEHANDLES IKKE"
}

interface StatusDetalj {
	beskrivelse: string;
	status: string;
	kommentarer?: React.ReactNode|string;
}

interface Props {
	status: string|null|SoknadsStatusEnum;
	sak?: null|SaksStatusState[];
	leserData: boolean;
}

const SoknadsStatus: React.FC<Props> = ({status, sak, leserData}) => {
	const antallSaksElementer: number = sak ? sak.length : 0;

	return (
		<Panel className={"panel-uthevet " + (antallSaksElementer > 0 ? "panel-uthevet-luft-under" : "")}>
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
				{status === SoknadsStatusEnum.FERDIGBEHANDLET && (
					<>
						<Innholdstittel><FormattedMessage id="status.ferdigbehandlet" /></Innholdstittel>
						<DokumentOk />
					</>
				)}
				{status === SoknadsStatusEnum.BEHANDLES_IKKE && (
					<>
						<Innholdstittel><FormattedMessage id="status.behandles_ikke" /></Innholdstittel>
						<DokumentOk />
					</>
				)}
			</div>

			{status === SoknadsStatusEnum.BEHANDLES_IKKE && antallSaksElementer === 0 && (
				<div className="status_detalj_panel status_detalj_panel_luft_under">
					<Element><FormattedMessage id="saker.default_tittel" /></Element>
					<div className="panel-glippe-over">
						<Normaltekst>
							<FormattedMessage id="status.behandles_ikke_ingress" />
						</Normaltekst>
					</div>
				</div>
			)}

			{sak && sak.map((statusdetalj: SaksStatusState, index: number) => {
				const saksStatus = statusdetalj.status.replace(/_/g,' ');
				const kanVises: boolean = statusdetalj.status !== Utfall.KAN_IKKE_VISES;
				return (
					<div className="status_detalj_panel" key={index}>
						<Element>{statusdetalj.tittel}</Element>
						{kanVises && saksStatus !== SaksStatusEnum.BEHANDLES_IKKE && status !== SoknadsStatusEnum.BEHANDLES_IKKE &&(
							<div className="status_detalj_panel__status">
								<EtikettLiten>{saksStatus}</EtikettLiten>
							</div>
						)}

						{statusdetalj.vedtaksfilUrlList && statusdetalj.vedtaksfilUrlList.map((hendelse: VedtakFattet, index: number) => (
							<div className="status_detalj_panel__kommentarer" key={index}>
								<EksternLenke href={"" + hendelse.vedtaksfilUrl}>
									Vedtaksbrev
									(<DatoOgKlokkeslett bareDato={true} tidspunkt={hendelse.dato}/>)
								</EksternLenke>
							</div>
						))}
						{statusdetalj.melding && statusdetalj.melding.length > 0 && (
							<div className="panel-glippe-over">
								<Normaltekst>
									{statusdetalj.melding}
								</Normaltekst>
							</div>
						)}
						{(saksStatus === SaksStatusEnum.BEHANDLES_IKKE || status === SoknadsStatusEnum.BEHANDLES_IKKE) && (
						<div className="panel-glippe-over">
							<Normaltekst>
								<FormattedMessage id="status.behandles_ikke_ingress" />
							</Normaltekst>
						</div>
						)}
					</div>
				)
			})}

		</Panel>
	);
};

export default SoknadsStatus;
