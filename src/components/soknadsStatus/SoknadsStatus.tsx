import React from "react";
import {SaksStatus, SaksStatusState, VedtakFattet} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import {FormattedMessage, IntlShape, useIntl} from "react-intl";
import Lastestriper from "../lastestriper/Lasterstriper";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import {SoknadsStatusEnum, soknadsStatusTittel} from "./soknadsStatusUtils";
import {REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Alert, BodyShort, Heading, Label, Panel, Tag} from "@navikt/ds-react";
import {ErrorColored, PlaceFilled} from "@navikt/ds-icons";
import styled from "styled-components/macro";
import SoknadsStatusLenke from "./SoknadsStatusLenke";
import SoknadsStatusTag from "./SoknadsStatusTag";
import {v4 as uuidv4} from "uuid";

const Container = styled.div`
    padding-top: 3rem;
`;

const ContentPanel = styled(Panel)<{error?: boolean}>`
    border-color: ${(props) => (props.error ? "var(--a-red-500)" : "transparent")};
    padding-top: 2rem;
    position: relative;
`;

const Spot = styled.div`
    position: absolute;
    transform: translate(-50%, -50%);
    top: 0;
    left: 50%;
    background: var(--a-surface-success-subtle);
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
`;

const SpotIcon = styled(PlaceFilled).attrs({
    title: "spot",
})`
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
        padding: 1rem 0;
    }
`;

const StyledErrorColored = styled(ErrorColored)`
    position: absolute;

    @media screen and (min-width: 641px) {
        top: 3rem;
        left: 1.5rem;
    }
    @media screen and (max-width: 640px) {
        top: 3.15rem;
        left: 1rem;
    }
`;

const StyledAlert = styled(Alert)`
    margin-bottom: 1rem;
`;

interface ContentPanelBorderProps {
    lightColor?: boolean;
}

const ContentPanelBorder = styled.div<ContentPanelBorderProps>`
    border-bottom: 2px solid var(${(props) => (props.lightColor ? "--a-border-on-inverted" : "--a-border-default")});
    margin: 1rem 0;
`;

const StatusBox = styled.div`
    margin: 0 1rem;
`;

const StatusMessage = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    .navds-tag {
        white-space: nowrap;
    }
`;

const StatusMessageVedtak = styled.div`
    line-height: 22px;
    margin-top: 6px;
`;

const StyledTextPlacement = styled.div`
    @media screen and (max-width: 640px) {
        margin-left: 2rem;
    }
`;

interface Props {
    soknadsStatus: SoknadsStatusEnum | null;
    sak: null | SaksStatusState[];
    restStatus: REST_STATUS;
}

const HeadingWrapper = styled.div`
    text-align: center;
`;

const leserData = (restStatus: REST_STATUS): boolean => {
    return (
        restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING || restStatus === REST_STATUS.OK
    );
};

const SoknadsStatus: React.FC<Props> = ({soknadsStatus, sak, restStatus}) => {
    const intl: IntlShape = useIntl();
    const soknadBehandlesIkke = soknadsStatus === SoknadsStatusEnum.BEHANDLES_IKKE;
    const hasError = !leserData(restStatus);

    const onVisVedtak = () => {
        logButtonOrLinkClick("Åpnet vedtaksbrev");
    };

    return (
        <Container>
            <ContentPanel error={+hasError}>
                <Spot>
                    <SpotIcon aria-hidden />
                </Spot>
                <ContentPanelBody>
                    {hasError && <StyledErrorColored />}
                    {hasError && (
                        <StyledTextPlacement>
                            <FormattedMessage id="feilmelding.soknadStatus_innlasting" />
                        </StyledTextPlacement>
                    )}
                    {skalViseLastestripe(restStatus, true) && <Lastestriper linjer={1} />}
                    {restStatus !== REST_STATUS.FEILET && (
                        <HeadingWrapper>
                            <Heading level="2" size="large" spacing>
                                {soknadsStatusTittel(soknadsStatus, intl)}
                            </Heading>
                            <SoknadsStatusLenke status={soknadsStatus} />
                            <ContentPanelBorder />
                        </HeadingWrapper>
                    )}

                    {soknadsStatus === SoknadsStatusEnum.BEHANDLES_IKKE && (
                        <StyledAlert variant="info">
                            <FormattedMessage id="status.soknad_behandles_ikke_ingress" />
                        </StyledAlert>
                    )}

                    {!hasError && sak?.length === 0 && !soknadBehandlesIkke && (
                        <StatusBox>
                            <StatusMessage>
                                <Label as="p">{intl.formatMessage({id: "saker.default_tittel"})}</Label>
                                <SoknadsStatusTag status={soknadsStatus} intl={intl} />
                            </StatusMessage>
                        </StatusBox>
                    )}

                    {!hasError &&
                        sak &&
                        sak.map((statusdetalj: SaksStatusState, index: number) => {
                            const saksStatus = statusdetalj.status;
                            const sakIkkeInnsyn = saksStatus === SaksStatus.IKKE_INNSYN;
                            const sakBehandlesIkke = saksStatus === SaksStatus.BEHANDLES_IKKE;
                            const randomId = uuidv4();
                            return (
                                <React.Fragment key={randomId}>
                                    <StatusBox key={index}>
                                        <StatusMessage>
                                            <Label as="p">{statusdetalj.tittel}</Label>
                                            {saksStatus === SaksStatus.FERDIGBEHANDLET && (
                                                <Tag variant="success">
                                                    <FormattedMessage id="saksStatus.ferdig_behandlet" />
                                                </Tag>
                                            )}
                                            {saksStatus === SaksStatus.UNDER_BEHANDLING && !soknadBehandlesIkke && (
                                                <Tag variant="warning">
                                                    <FormattedMessage id="saksStatus.under_behandling" />
                                                </Tag>
                                            )}
                                        </StatusMessage>
                                        {statusdetalj.melding && statusdetalj.melding.length > 0 && (
                                            <BodyShort>{statusdetalj.melding}</BodyShort>
                                        )}
                                        {sakBehandlesIkke && !soknadBehandlesIkke && (
                                            <BodyShort>
                                                <FormattedMessage id="status.sak_behandles_ikke_ingress" />
                                            </BodyShort>
                                        )}
                                        {sakIkkeInnsyn && !soknadBehandlesIkke && (
                                            <BodyShort>
                                                <FormattedMessage id="status.ikke_innsyn_ingress" />
                                            </BodyShort>
                                        )}

                                        {statusdetalj.vedtaksfilUrlList &&
                                            statusdetalj.vedtaksfilUrlList.map((hendelse: VedtakFattet, id: number) => (
                                                <StatusMessage key={id}>
                                                    <StatusMessageVedtak>
                                                        <EksternLenke
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
                                </React.Fragment>
                            );
                        })}
                </ContentPanelBody>
            </ContentPanel>
        </Container>
    );
};

export default SoknadsStatus;
