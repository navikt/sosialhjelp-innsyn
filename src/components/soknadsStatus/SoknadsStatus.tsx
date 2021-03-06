import React from "react";
import Panel from "nav-frontend-paneler";
import {Element, Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import "./soknadsStatus.less";
import {SaksStatus, SaksStatusState, VedtakFattet} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import {FormattedMessage, IntlShape, useIntl} from "react-intl";
import Lastestriper from "../lastestriper/Lasterstriper";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import {SoknadsStatusEnum, soknadsStatusTittel} from "./soknadsStatusUtils";
import {AlertStripeInfo} from "nav-frontend-alertstriper";
import {REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import DokumentSendt from "../ikoner/DokumentSendt";
import DokumentOk from "../ikoner/DokumentOk";
import DokumentMottatt from "../ikoner/DokumentMottatt";
import DokumentElla from "../ikoner/DocumentElla";
import {EtikettLiten} from "../etikett/EtikettLiten";

export const hentSaksStatusTittel = (saksStatus: SaksStatus) => {
    switch (saksStatus) {
        case SaksStatus.UNDER_BEHANDLING:
            return "saksStatus.under_behandling";
        case SaksStatus.FERDIGBEHANDLET:
            return "saksStatus.ferdig_behandlet";
        case SaksStatus.BEHANDLES_IKKE:
        case SaksStatus.IKKE_INNSYN:
            return "saksStatus.kan_ikke_vise_status";
        default:
            return "";
    }
};

interface Props {
    status: string | null | SoknadsStatusEnum;
    sak: null | SaksStatusState[];
    restStatus: REST_STATUS;
}

const SoknadsStatus: React.FC<Props> = ({status, sak, restStatus}) => {
    const antallSaksElementer: number = sak ? sak.length : 0;
    const intl: IntlShape = useIntl();

    return (
        <Panel className={"panel-uthevet " + (antallSaksElementer > 0 ? "panel-uthevet-luft-under" : "")}>
            <div className="tittel_og_ikon">
                {skalViseLastestripe(restStatus) && <Lastestriper linjer={1} />}
                {restStatus !== REST_STATUS.FEILET && (
                    <>
                        <Innholdstittel>{soknadsStatusTittel(status, intl)}</Innholdstittel>
                        {status === SoknadsStatusEnum.SENDT && <DokumentSendt />}
                        {status === SoknadsStatusEnum.MOTTATT && <DokumentMottatt />}
                        {status === SoknadsStatusEnum.UNDER_BEHANDLING && <DokumentElla />}
                        {status === SoknadsStatusEnum.FERDIGBEHANDLET && <DokumentOk />}
                        {status === SoknadsStatusEnum.BEHANDLES_IKKE && <DokumentOk />}
                    </>
                )}
            </div>

            {status === SoknadsStatusEnum.BEHANDLES_IKKE && antallSaksElementer === 0 && (
                <div className="status_detalj_panel_info_alert_luft_under">
                    <AlertStripeInfo>
                        <FormattedMessage id="status.soknad_behandles_ikke_ingress" />
                    </AlertStripeInfo>
                </div>
            )}

            {status === SoknadsStatusEnum.BEHANDLES_IKKE && antallSaksElementer !== 0 && (
                <div className="status_detalj_panel_info_alert">
                    <AlertStripeInfo>
                        <FormattedMessage id="status.soknad_behandles_ikke_ingress" />
                    </AlertStripeInfo>
                </div>
            )}

            {sak &&
                sak.map((statusdetalj: SaksStatusState, index: number) => {
                    const saksStatus = statusdetalj.status;
                    const sakIkkeInnsyn = saksStatus === SaksStatus.IKKE_INNSYN;
                    const sakBehandlesIkke = saksStatus === SaksStatus.BEHANDLES_IKKE;
                    const soknadBehandlesIkke = status === SoknadsStatusEnum.BEHANDLES_IKKE;
                    return (
                        <div className="status_detalj_panel" key={index}>
                            <div className={"status_detalj_linje"}>
                                <div className="status_detalj_panel__tittel">
                                    <Element>{statusdetalj.tittel}</Element>
                                </div>
                                <div className="status_detalj_panel__status">
                                    <EtikettLiten>
                                        {soknadBehandlesIkke ? (
                                            <FormattedMessage id={hentSaksStatusTittel(SaksStatus.BEHANDLES_IKKE)} />
                                        ) : (
                                            <FormattedMessage id={hentSaksStatusTittel(saksStatus)} />
                                        )}
                                    </EtikettLiten>
                                </div>
                            </div>
                            {statusdetalj.melding && statusdetalj.melding.length > 0 && (
                                <div className="panel-glippe-over">
                                    <Normaltekst>{statusdetalj.melding}</Normaltekst>
                                </div>
                            )}
                            {sakBehandlesIkke && !soknadBehandlesIkke && (
                                <div className="panel-glippe-over">
                                    <Normaltekst>
                                        <FormattedMessage id="status.sak_behandles_ikke_ingress" />
                                    </Normaltekst>
                                </div>
                            )}
                            {sakIkkeInnsyn && !soknadBehandlesIkke && (
                                <div className="panel-glippe-over">
                                    <Normaltekst>
                                        <FormattedMessage id="status.ikke_innsyn_ingress" />
                                    </Normaltekst>
                                </div>
                            )}

                            {statusdetalj.vedtaksfilUrlList &&
                                statusdetalj.vedtaksfilUrlList.map((hendelse: VedtakFattet, index: number) => (
                                    <div className={"status_detalj_linje"} key={index}>
                                        <div className="status_detalj_panel__kommentarer">
                                            <EksternLenke href={"" + hendelse.vedtaksfilUrl} target="_blank">
                                                Vedtak (<DatoOgKlokkeslett bareDato={true} tidspunkt={hendelse.dato} />)
                                            </EksternLenke>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    );
                })}
        </Panel>
    );
};

export default SoknadsStatus;
