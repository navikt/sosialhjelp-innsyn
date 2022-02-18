import React from "react";
import "./soknadsStatus.less";
import {SaksStatus, SaksStatusState, VedtakFattet} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import {FormattedMessage, IntlShape, useIntl} from "react-intl";
import Lastestriper from "../lastestriper/Lasterstriper";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import {SoknadsStatusEnum, soknadsStatusTittel} from "./soknadsStatusUtils";
import {REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Alert, BodyShort, GuidePanel, Heading, Label, Tag} from "@navikt/ds-react";
import {PlaceFilled} from "@navikt/ds-icons";
import styled from "styled-components";

const StatusDetalje = styled.div`
    border-bottom: 1px solid var(--navds-semantic-color-border-muted);
    border-radius: 2px;
    padding: 1rem;
    position: relative;
    //margin: 2rem 0 4px 0;

    @media screen and (min-width: 641px) {
        &_luft_under {
            margin-bottom: 2rem;
        }
    }
`;

const StatusDetaljLinje = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: normal;
`;

const StatusDetaljPanelTittel = styled.div`
    @media screen and (min-width: 641px) {
        width: 70%;
    }
    @media screen and (max-width: 640px) {
        width: 50%;
    }
`;

const StatusDetaljPanelStatus = styled.div`
    display: flex;
    align-items: center;
    text-transform: uppercase;
    background-color: white;
`;

const StatusDetaljPanelKommentarer = styled.div`
    line-height: 22px;
    margin-top: 6px;
`;

const StyledHeading = styled(Heading)`
    text-align: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--navds-semantic-color-border-muted);
`;

const StyledGuidePanel = styled(GuidePanel)`
    --navds-guide-panel-color-border: 0;
    --navds-guide-panel-color-illustration-background: var(--navds-semantic-color-feedback-success-background);
`;

export const hentSaksStatusTittel = (saksStatus: SaksStatus) => {
    switch (saksStatus) {
        case SaksStatus.UNDER_BEHANDLING:
            return "saksStatus.under_behandling";
        case SaksStatus.FERDIGBEHANDLET:
            return "saksStatus.ferdig_behandlet";
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
        <StyledGuidePanel poster illustration={<PlaceFilled />}>
            {skalViseLastestripe(restStatus) && <Lastestriper linjer={1} />}
            {restStatus !== REST_STATUS.FEILET && (
                <StyledHeading level="1" size="large">
                    {soknadsStatusTittel(status, intl)}
                </StyledHeading>
            )}

            {status === SoknadsStatusEnum.BEHANDLES_IKKE && antallSaksElementer === 0 && (
                <div className="status_detalj_panel_info_alert_luft_over">
                    <Alert variant="info">
                        test 2
                        <FormattedMessage id="status.soknad_behandles_ikke_ingress" />
                    </Alert>
                </div>
            )}

            {status === SoknadsStatusEnum.BEHANDLES_IKKE && antallSaksElementer !== 0 && (
                <div className="status_detalj_panel_info_alert_luft_over">
                    <Alert variant="info">
                        test 3
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
                        <StatusDetalje key={index}>
                            <StatusDetaljLinje>
                                <Label>{statusdetalj.tittel}</Label>
                                {!(sakBehandlesIkke || sakIkkeInnsyn) && (
                                    <>
                                        {saksStatus === SaksStatus.FERDIGBEHANDLET && (
                                            <Tag variant="success">
                                                <FormattedMessage id={hentSaksStatusTittel(saksStatus)} />
                                            </Tag>
                                        )}
                                        {saksStatus === SaksStatus.UNDER_BEHANDLING && (
                                            <Tag variant="warning">
                                                <FormattedMessage id={hentSaksStatusTittel(saksStatus)} />
                                            </Tag>
                                        )}
                                    </>
                                )}
                            </StatusDetaljLinje>
                            {statusdetalj.melding && statusdetalj.melding.length > 0 && (
                                <div>
                                    <BodyShort>{statusdetalj.melding}</BodyShort>
                                </div>
                            )}
                            {sakBehandlesIkke && !soknadBehandlesIkke && (
                                <div>
                                    <BodyShort>
                                        <FormattedMessage id="status.sak_behandles_ikke_ingress" />
                                    </BodyShort>
                                </div>
                            )}
                            {sakIkkeInnsyn && !soknadBehandlesIkke && (
                                <div>
                                    <BodyShort>
                                        <FormattedMessage id="status.ikke_innsyn_ingress" />
                                    </BodyShort>
                                </div>
                            )}

                            {statusdetalj.vedtaksfilUrlList &&
                                statusdetalj.vedtaksfilUrlList.map((hendelse: VedtakFattet, index: number) => (
                                    <div key={index}>
                                        <div>
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
                        </StatusDetalje>
                    );
                })}
        </StyledGuidePanel>
    );
};

export default SoknadsStatus;
