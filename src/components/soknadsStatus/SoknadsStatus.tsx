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

const StyledGuidePanel = styled(GuidePanel)`
    --navds-guide-panel-color-border: 0;
    --navds-guide-panel-color-illustration-background: var(--navds-semantic-color-feedback-success-background);
    .navds-guide__illustration svg,
    .navds-guide__illustration img {
        height: 2.5rem;
        width: 5rem;
        top: 30%;
        left: 10%;
        position: fixed;
    }
`;

const StyledHeading = styled(Heading)`
    text-align: center;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--navds-semantic-color-border-muted);
`;

const StyledStatusBox = styled.div`
    border-bottom: 2px solid var(--navds-semantic-color-border-muted);
    border-radius: 2px;
    padding: 1rem;
    position: relative;
`;

const StyledStatusMessage = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: normal;
`;

const StyledStatusMessageVedtak = styled.div`
    line-height: 22px;
    margin-top: 6px;
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
                <Alert variant="info">
                    <FormattedMessage id="status.soknad_behandles_ikke_ingress" />
                </Alert>
            )}

            {status === SoknadsStatusEnum.BEHANDLES_IKKE && antallSaksElementer !== 0 && (
                <Alert variant="info">
                    <FormattedMessage id="status.soknad_behandles_ikke_ingress" />
                </Alert>
            )}

            {sak &&
                sak.map((statusdetalj: SaksStatusState, index: number) => {
                    const saksStatus = statusdetalj.status;
                    const sakIkkeInnsyn = saksStatus === SaksStatus.IKKE_INNSYN;
                    const sakBehandlesIkke = saksStatus === SaksStatus.BEHANDLES_IKKE;
                    const soknadBehandlesIkke = status === SoknadsStatusEnum.BEHANDLES_IKKE;
                    return (
                        <StyledStatusBox key={index}>
                            <StyledStatusMessage>
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
                            </StyledStatusMessage>
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
                                    <StyledStatusMessage key={index}>
                                        <StyledStatusMessageVedtak>
                                            <EksternLenke
                                                href={"" + hendelse.vedtaksfilUrl}
                                                target="_blank"
                                                onClick={onVisVedtak}
                                            >
                                                Vedtak (
                                                <DatoOgKlokkeslett bareDato={true} tidspunkt={hendelse.dato} />)
                                            </EksternLenke>
                                        </StyledStatusMessageVedtak>
                                    </StyledStatusMessage>
                                ))}
                        </StyledStatusBox>
                    );
                })}
        </StyledGuidePanel>
    );
};

export default SoknadsStatus;
