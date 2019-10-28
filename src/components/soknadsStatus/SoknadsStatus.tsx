import React from 'react';
import {Panel} from "nav-frontend-paneler";
import {Element, EtikettLiten, Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import DokumentMottatt from "../ikoner/DokumentMottatt";
import DokumentElla from "../ikoner/DocumentElla";
import "./soknadsStatus.less";
import {Hendelse, SaksStatusState, Utfall} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import {FormattedMessage} from "react-intl";
import Lastestriper from "../lastestriper/Lasterstriper";
import DokumentOk from "../ikoner/DokumentOk";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";

export enum SoknadsStatusEnum {
	MOTTATT = "MOTTATT",
	UNDER_BEHANDLING = "UNDER_BEHANDLING",
	FERDIGBEHANDLET = "FERDIGBEHANDLET",
	BEHANDLES_IKKE = "BEHANDLES_IKKE"
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
	const antallSaksStatusElementer: number = saksStatus ? saksStatus.length : 0;

	return (
		<Panel className={"panel-uthevet " + (antallSaksStatusElementer > 0 ? "panel-uthevet-luft-under" : "")}>
			<div className="tittel_og_ikon">
				{leserData && (
					<Lastestriper linjer={1}/>
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

			{status === SoknadsStatusEnum.BEHANDLES_IKKE && (
				<div className="status_detalj_panel status_detalj_panel_luft_under">
					<Element>Livshopphold</Element>
					<div className="panel-glippe-over">
						<Normaltekst>
							Vi kan ikke vise behandlingsstatus på nett. Dette kan være fordi
							søknaden behandles sammen med en annen søknad du har sendt inn.
							Ta kontakt med ditt NAV-kontor dersom du har spørsmål
						</Normaltekst>
					</div>
				</div>
			)}

			{saksStatus && saksStatus.map((statusdetalj: SaksStatusState, index: number) => {
				const status = statusdetalj.status.replace(/_/g,' ');
				const kanVises: boolean = statusdetalj.status !== Utfall.KAN_IKKE_VISES;
				return (
					<div className="status_detalj_panel" key={index}>
						<Element>{statusdetalj.tittel}</Element>
						{kanVises && (
							<div className="status_detalj_panel__status">
								<EtikettLiten>{status}</EtikettLiten>
							</div>
						)}

						{statusdetalj.vedtaksfiler && statusdetalj.vedtaksfiler.map((hendelse: Hendelse, index: number) => (
							<div className="status_detalj_panel__kommentarer" key={index}>
								<EksternLenke href={"todo_url_" + hendelse.filUrl}>
									{hendelse.beskrivelse}&nbsp;
									(<DatoOgKlokkeslett bareDato={true} tidspunkt={hendelse.tidspunkt}/>)
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
					</div>
				)
			})}

		</Panel>
	);
};

export default SoknadsStatus;
