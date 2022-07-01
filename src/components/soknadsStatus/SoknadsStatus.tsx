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
import {Alert, BodyShort, Heading, Label, Panel, Tag} from "@navikt/ds-react";
import {PlaceFilled} from "@navikt/ds-icons";
import styled from "styled-components/macro";
import SoknadsStatusLenke from "./SoknadsStatusLenke";

const Container = styled.div`
    padding-top: 3rem;
`;

const ContentPanel = styled(Panel)`
    padding-top: 2rem;
    position: relative;
`;

const Spot = styled.div`
    position: absolute;
    transform: translate(-50%, -50%);
    top: 0;
    left: 50%;
    background: var(--navds-semantic-color-feedback-success-background);
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
`;

const SpotIcon = styled(PlaceFilled)`
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    height: 1.5rem;
    width: 1.5rem;
`;

const ContentPanelBody = styled.div`
    @media screen and (min-width: 641px) {
        padding: 1rem 3.25rem 1rem 3.25rem;
    }
    @media screen and (max-width: 640px) {
        padding: 2rem;
    }
`;

interface ContentPanelBorderProps {
    lightColor?: boolean;
}

const ContentPanelBorder = styled.div<ContentPanelBorderProps>`
    border-bottom: 2px solid
        var(
            ${(props) =>
                props.lightColor ? "--navds-semantic-color-border-inverted" : "--navds-semantic-color-border-muted"}
        );
    margin: 1rem 0;
`;

const StatusBox = styled.div`
    margin: 0 1rem;
`;

const StatusMessage = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: normal;
`;

const StatusMessageVedtak = styled.div`
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
    status: SoknadsStatusEnum | null;
    sak: null | SaksStatusState[];
    restStatus: REST_STATUS;
}

const HeadingWrapper = styled.div`
    text-align: center;
    @media only screen and (max-width: 480px) {
        a {
            text-align: left;
        }
    }
`;

const SoknadsStatus: React.FC<Props> = ({status, sak, restStatus}) => {
    const antallSaksElementer: number = sak ? sak.length : 0;
    const intl: IntlShape = useIntl();

    const onVisVedtak = () => {
        logButtonOrLinkClick("Åpnet vedtaksbrev");
    };

    return (
        <Container>
            <ContentPanel>
                <Spot>
                    <SpotIcon />
                </Spot>
                <ContentPanelBody>
                    {skalViseLastestripe(restStatus) && <Lastestriper linjer={1} />}
                    {restStatus !== REST_STATUS.FEILET && (
                        <HeadingWrapper>
                            <Heading level="2" size="large" spacing>
                                {soknadsStatusTittel(status, intl)}
                            </Heading>
                            <SoknadsStatusLenke status={status} />
                            <ContentPanelBorder />
                        </HeadingWrapper>
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
                                <>
                                    <StatusBox key={index}>
                                        <StatusMessage>
                                            <Label>{statusdetalj.tittel}</Label>
                                            {!(sakBehandlesIkke || sakIkkeInnsyn) && (
                                                <>
                                                    {saksStatus === SaksStatus.FERDIGBEHANDLET && (
                                                        <Tag variant="success">
                                                            <FormattedMessage id={hentSaksStatusTittel(saksStatus)} />
                                                        </Tag>
                                                    )}
                                                    {saksStatus === SaksStatus.UNDER_BEHANDLING &&
                                                        status !== SoknadsStatusEnum.BEHANDLES_IKKE && (
                                                            <Tag variant="warning">
                                                                <FormattedMessage
                                                                    id={hentSaksStatusTittel(saksStatus)}
                                                                />
                                                            </Tag>
                                                        )}
                                                </>
                                            )}
                                        </StatusMessage>
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
                                            statusdetalj.vedtaksfilUrlList.map((hendelse: VedtakFattet, id: number) => (
                                                <StatusMessage key={id}>
                                                    <StatusMessageVedtak>
                                                        <EksternLenke
                                                            rel="noopener noreferrer"
                                                            href={"" + hendelse.vedtaksfilUrl}
                                                            onClick={onVisVedtak}
                                                        >
                                                            Vedtak (
                                                            <DatoOgKlokkeslett
                                                                bareDato={true}
                                                                tidspunkt={hendelse.dato}
                                                            />
                                                            )
                                                        </EksternLenke>
                                                    </StatusMessageVedtak>
                                                </StatusMessage>
                                            ))}
                                    </StatusBox>
                                    <ContentPanelBorder lightColor />
                                </>
                            );
                        })}
                </ContentPanelBody>
            </ContentPanel>
        </Container>
    );
};

export default SoknadsStatus;
