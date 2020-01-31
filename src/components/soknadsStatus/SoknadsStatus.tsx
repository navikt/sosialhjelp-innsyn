import React from 'react';
import {Panel} from "nav-frontend-paneler";
import {Element, EtikettLiten, Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import DokumentMottatt from "../ikoner/DokumentMottatt";
import DokumentElla from "../ikoner/DocumentElla";
import "./soknadsStatus.less";
import {SaksStatus, SaksStatusState, VedtakFattet} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import {FormattedMessage, IntlShape, useIntl} from "react-intl";
import Lastestriper from "../lastestriper/Lasterstriper";
import DokumentOk from "../ikoner/DokumentOk";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import DokumentSendt from "../ikoner/DokumentSendt";
import {SaksStatusEnum, SoknadsStatusEnum, soknadsStatusTittel} from "./soknadsStatusUtils";

interface Props {
    status: string | null | SoknadsStatusEnum;
    sak: null | SaksStatusState[];
    leserData: boolean;
}

const SoknadsStatus: React.FC<Props> = ({status, sak, leserData}) => {
    const antallSaksElementer: number = sak ? sak.length : 0;
    const intl: IntlShape = useIntl();

    return (
        <Panel className={"panel-uthevet " + (antallSaksElementer > 0 ? "panel-uthevet-luft-under" : "")}>
            <div className="tittel_og_ikon">
                {leserData && (
                    <Lastestriper linjer={1}/>
                )}
                <Innholdstittel>{soknadsStatusTittel(status, intl)}</Innholdstittel>
                {status === SoknadsStatusEnum.SENDT && (
                    <DokumentSendt/>
                )}
                {status === SoknadsStatusEnum.MOTTATT && (
                    <DokumentMottatt/>
                )}
                {status === SoknadsStatusEnum.UNDER_BEHANDLING && (
                    <DokumentElla/>
                )}
                {status === SoknadsStatusEnum.FERDIGBEHANDLET && (
                    <DokumentOk/>
                )}
                {status === SoknadsStatusEnum.BEHANDLES_IKKE && (
                    <DokumentOk/>
                )}
            </div>

            {status === SoknadsStatusEnum.BEHANDLES_IKKE && antallSaksElementer === 0 && (
                <div className="status_detalj_panel status_detalj_panel_luft_under">
                    <Element><FormattedMessage id="saker.default_tittel"/></Element>
                    <div className="panel-glippe-over">
                        <Normaltekst>
                            <FormattedMessage id="status.behandles_ikke_ingress"/>
                        </Normaltekst>
                    </div>
                </div>
            )}

            {sak && sak.map((statusdetalj: SaksStatusState, index: number) => {
                let saksStatus = statusdetalj.status.replace(/_/g, ' ');
                saksStatus = saksStatus === "FERDIGBEHANDLET" ? "FERDIG BEHANDLET" : saksStatus;
                const kanVises: boolean = statusdetalj.status !== SaksStatus.IKKE_INNSYN;
                return (
                    <div className="status_detalj_panel" key={index}>
                        <div className={"status_detalj_linje"}>
                            <div className="status_detalj_panel__tittel">
                                <Element>{statusdetalj.tittel}</Element>
                            </div>
                            {kanVises
                            && saksStatus !== SaksStatusEnum.IKKE_INNSYN
                            && saksStatus !== SaksStatusEnum.BEHANDLES_IKKE
                            && status !== SoknadsStatusEnum.BEHANDLES_IKKE
                            && (
                                <div className="status_detalj_panel__status">
                                    <EtikettLiten>{saksStatus}</EtikettLiten>
                                </div>
                            )}
                        </div>

                        {statusdetalj.melding && statusdetalj.melding.length > 0 && (
                            <div className="panel-glippe-over">
                                <Normaltekst>
                                    {statusdetalj.melding}
                                </Normaltekst>
                            </div>
                        )}
                        {((saksStatus === SaksStatusEnum.BEHANDLES_IKKE || status === SoknadsStatusEnum.BEHANDLES_IKKE) && saksStatus !== SaksStatusEnum.IKKE_INNSYN) && (
                            <div className="panel-glippe-over">
                                <Normaltekst>
                                    <FormattedMessage id="status.behandles_ikke_ingress"/>
                                </Normaltekst>
                            </div>
                        )}
                        {(saksStatus === SaksStatusEnum.IKKE_INNSYN && status === SoknadsStatusEnum.BEHANDLES_IKKE) && (
                            <div className="panel-glippe-over">
                                <Normaltekst>
                                    <FormattedMessage id="status.ikke_innsyn_ingress"/>
                                </Normaltekst>
                            </div>
                        )}
                        {(saksStatus === SaksStatusEnum.IKKE_INNSYN && status !== SoknadsStatusEnum.BEHANDLES_IKKE) && (
                            <div className="panel-glippe-over">
                                <Normaltekst>
                                    <FormattedMessage id="status.ikke_innsyn_ingress"/>
                                </Normaltekst>
                            </div>
                        )}
                        


                        {statusdetalj.vedtaksfilUrlList && statusdetalj.vedtaksfilUrlList.map((hendelse: VedtakFattet, index: number) => (
                            <div className={"status_detalj_linje"} key={index}>
                                <div className="status_detalj_panel__kommentarer">
                                    <EksternLenke href={"" + hendelse.vedtaksfilUrl} target="_blank">
                                        Vedtak
                                        (<DatoOgKlokkeslett bareDato={true} tidspunkt={hendelse.dato}/>)
                                    </EksternLenke>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            })}

        </Panel>
    );
};

export default SoknadsStatus;
