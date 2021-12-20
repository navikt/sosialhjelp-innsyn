import React from "react";
import "./soknadsStatus.less";
import {SaksStatus, SaksStatusState, VedtakFattet} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import {FormattedMessage, IntlShape, useIntl} from "react-intl";
import Lastestriper from "../lastestriper/Lasterstriper";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import {SoknadsStatusEnum, soknadsStatusTittel} from "./soknadsStatusUtils";
import {REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import DokumentSendt from "../ikoner/DokumentSendt";
import DokumentOk from "../ikoner/DokumentOk";
import DokumentMottatt from "../ikoner/DokumentMottatt";
import DokumentElla from "../ikoner/DocumentElla";
import {EtikettLiten} from "../etikett/EtikettLiten";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Alert, BodyShort, Heading, Label} from "@navikt/ds-react";
import {UthevetPanelEkstraPadding} from "../paneler/UthevetPanel";
import {TittelOgIkon} from "./TittelOgIkon";
import styled from "styled-components";

const StatusDetaljPanel = styled.div`
    max-width: 640px;
    border: 1px solid #c6c2bf;
    border-radius: 2px;
    padding: 1rem;
    position: relative;
    margin: 2rem 0 4px 0;

    @media screen and (min-width: 641px) {
        &_luft_under {
            margin-bottom: 2rem;
        }
    }
`;

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

    const onVisVedtak = () => {
        logButtonOrLinkClick("Åpnet vedtaksbrev");
    };

    return (
        <UthevetPanelEkstraPadding className={antallSaksElementer > 0 ? "panel-uthevet-luft-under" : ""}>
            <TittelOgIkon>
                {skalViseLastestripe(restStatus) && <Lastestriper linjer={1} />}
                {restStatus !== REST_STATUS.FEILET && (
                    <>
                        <Heading level="1" size="xlarge">
                            {soknadsStatusTittel(status, intl)}
                        </Heading>
                        {status === SoknadsStatusEnum.SENDT && <DokumentSendt />}
                        {status === SoknadsStatusEnum.MOTTATT && <DokumentMottatt />}
                        {status === SoknadsStatusEnum.UNDER_BEHANDLING && <DokumentElla />}
                        {status === SoknadsStatusEnum.FERDIGBEHANDLET && <DokumentOk />}
                        {status === SoknadsStatusEnum.BEHANDLES_IKKE && <DokumentOk />}
                    </>
                )}
            </TittelOgIkon>

            {status === SoknadsStatusEnum.BEHANDLES_IKKE && antallSaksElementer === 0 && (
                <div className="status_detalj_panel_info_alert_luft_over">
                    <Alert variant="info">
                        <FormattedMessage id="status.soknad_behandles_ikke_ingress" />
                    </Alert>
                </div>
            )}

            {status === SoknadsStatusEnum.BEHANDLES_IKKE && antallSaksElementer !== 0 && (
                <div className="status_detalj_panel_info_alert_luft_over">
                    <Alert variant="info">
                        <FormattedMessage id="status.soknad_behandles_ikke_ingress" />
                    </Alert>
                </div>
            )}

            {sak &&
                sak.map((statusdetalj: SaksStatusState, index: number) => {
                    const saksStatus = statusdetalj.status;
                    const sakIkkeInnsyn = saksStatus === SaksStatus.IKKE_INNSYN;
                    const sakBehandlesIkke = saksStatus === SaksStatus.BEHANDLES_IKKE;
                    const soknadBehandlesIkke = status === SoknadsStatusEnum.BEHANDLES_IKKE;
                    return (
                        <StatusDetaljPanel key={index}>
                            <div className={"status_detalj_linje"}>
                                <div className="status_detalj_panel__tittel">
                                    <Label>{statusdetalj.tittel}</Label>
                                </div>
                                <div className="status_detalj_panel__status">
                                    {!(soknadBehandlesIkke || sakIkkeInnsyn) && (
                                        <EtikettLiten>
                                            <FormattedMessage id={hentSaksStatusTittel(saksStatus)} />
                                        </EtikettLiten>
                                    )}
                                </div>
                            </div>
                            {statusdetalj.melding && statusdetalj.melding.length > 0 && (
                                <div className="panel-glippe-over">
                                    <BodyShort>{statusdetalj.melding}</BodyShort>
                                </div>
                            )}
                            {sakBehandlesIkke && !soknadBehandlesIkke && (
                                <div className="panel-glippe-over">
                                    <BodyShort>
                                        <FormattedMessage id="status.sak_behandles_ikke_ingress" />
                                    </BodyShort>
                                </div>
                            )}
                            {sakIkkeInnsyn && !soknadBehandlesIkke && (
                                <div className="panel-glippe-over">
                                    <BodyShort>
                                        <FormattedMessage id="status.ikke_innsyn_ingress" />
                                    </BodyShort>
                                </div>
                            )}

                            {statusdetalj.vedtaksfilUrlList &&
                                statusdetalj.vedtaksfilUrlList.map((hendelse: VedtakFattet, index: number) => (
                                    <div className={"status_detalj_linje"} key={index}>
                                        <div className="status_detalj_panel__kommentarer">
                                            <EksternLenke
                                                href={"" + hendelse.vedtaksfilUrl}
                                                target="_blank"
                                                onClick={onVisVedtak}
                                            >
                                                Vedtak (<DatoOgKlokkeslett bareDato={true} tidspunkt={hendelse.dato} />)
                                            </EksternLenke>
                                        </div>
                                    </div>
                                ))}
                        </StatusDetaljPanel>
                    );
                })}
        </UthevetPanelEkstraPadding>
    );
};

export default SoknadsStatus;
