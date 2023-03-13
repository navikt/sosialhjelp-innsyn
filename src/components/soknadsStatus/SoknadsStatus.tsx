import React from "react";
import EksternLenke from "../eksternLenke/EksternLenke";
import {useTranslation} from "react-i18next";
import Lastestriper from "../lastestriper/Lasterstriper";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import {soknadsStatusTittel} from "./soknadsStatusUtils";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Alert, BodyShort, Heading, Label, Panel, Tag} from "@navikt/ds-react";
import {ErrorColored, PlaceFilled} from "@navikt/ds-icons";
import styled from "styled-components/macro";
import SoknadsStatusLenke from "./SoknadsStatusLenke";
import SoknadsStatusTag from "./SoknadsStatusTag";
import {useHentSoknadsStatus} from "../../generated/soknads-status-controller/soknads-status-controller";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import {useHentSaksStatuser} from "../../generated/saks-status-controller/saks-status-controller";
import {
    SaksStatusResponse,
    SaksStatusResponseStatus,
    SoknadsStatusResponseStatus,
    VedtaksfilUrl,
} from "../../generated/model";

interface ContentPanelBorderProps {
    lightColor?: boolean;
}

const Container = styled.div`
    padding-top: 3rem;
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

const ContentPanel = styled(Panel)<{error?: boolean}>`
    border-color: ${(props) => (props.error ? "var(--a-red-500)" : "transparent")};
    padding-top: 2rem;
    position: relative;
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

const HeadingWrapper = styled.div`
    text-align: center;
`;

const SoknadsStatus = () => {
    const fiksDigisosId = useFiksDigisosId();

    const soknadsStatusQuery = useHentSoknadsStatus(fiksDigisosId);
    const saksStatusQuery = useHentSaksStatuser(fiksDigisosId);
    const {t} = useTranslation();

    const soknadBehandlesIkke = soknadsStatusQuery.data?.status === SoknadsStatusResponseStatus.BEHANDLES_IKKE;
    const hasError = soknadsStatusQuery.isError || saksStatusQuery.isError;
    const isLoading = soknadsStatusQuery.isLoading || saksStatusQuery.isLoading;

    const onVisVedtak = () => {
        logButtonOrLinkClick("Åpnet vedtaksbrev");
    };

    const soknadsStatus = soknadsStatusQuery.data?.status;

    return (
        <Container>
            <ContentPanel error={+hasError}>
                <Spot>
                    <SpotIcon aria-hidden />
                </Spot>
                <ContentPanelBody>
                    {hasError && <StyledErrorColored title="Feil" />}
                    {hasError && <StyledTextPlacement>{t("feilmelding.soknadStatus_innlasting")}</StyledTextPlacement>}
                    {isLoading && <Lastestriper linjer={1} />}
                    {soknadsStatus && !hasError && (
                        <HeadingWrapper>
                            <Heading level="2" size="large" spacing>
                                {soknadsStatusTittel(soknadsStatus, t)}
                            </Heading>
                            <SoknadsStatusLenke status={soknadsStatus} />
                            <ContentPanelBorder />
                        </HeadingWrapper>
                    )}

                    {soknadsStatus === SoknadsStatusResponseStatus.BEHANDLES_IKKE && (
                        <StyledAlert variant="info">{t("status.soknad_behandles_ikke_ingress")}</StyledAlert>
                    )}

                    {!hasError && soknadsStatus && saksStatusQuery.data?.length === 0 && !soknadBehandlesIkke && (
                        <StatusBox>
                            <StatusMessage>
                                <Label as="p">{t("saker.default_tittel")}</Label>
                                <SoknadsStatusTag status={soknadsStatus} />
                            </StatusMessage>
                        </StatusBox>
                    )}

                    {!hasError &&
                        saksStatusQuery.data &&
                        saksStatusQuery.data.map((statusdetalj: SaksStatusResponse, index: number) => {
                            const saksStatus = statusdetalj.status;
                            const sakIkkeInnsyn = saksStatus === SaksStatusResponseStatus.IKKE_INNSYN;
                            const sakBehandlesIkke = saksStatus === SaksStatusResponseStatus.BEHANDLES_IKKE;
                            return (
                                <React.Fragment key={index}>
                                    <StatusBox>
                                        <StatusMessage>
                                            <Label as="p">{statusdetalj.tittel}</Label>
                                            {saksStatus === SaksStatusResponseStatus.FERDIGBEHANDLET && (
                                                <Tag variant="success">{t("saksStatus.ferdig_behandlet")}</Tag>
                                            )}
                                            {saksStatus === SaksStatusResponseStatus.UNDER_BEHANDLING &&
                                                !soknadBehandlesIkke && (
                                                    <Tag variant="warning">{t("saksStatus.under_behandling")}</Tag>
                                                )}
                                        </StatusMessage>
                                        {/* TODO: Finnes denne her enkly? */}
                                        {/*{statusdetalj.melding && statusdetalj.melding.length > 0 && (*/}
                                        {/*    <BodyShort>{statusdetalj.melding}</BodyShort>*/}
                                        {/*)}*/}
                                        {sakBehandlesIkke && !soknadBehandlesIkke && (
                                            <BodyShort>{t("saksStatus.sak_behandles_ikke_ingress")}</BodyShort>
                                        )}
                                        {sakIkkeInnsyn && !soknadBehandlesIkke && (
                                            <BodyShort>{t("status.ikke_innsyn_ingress")}</BodyShort>
                                        )}

                                        {statusdetalj.vedtaksfilUrlList &&
                                            statusdetalj.vedtaksfilUrlList.map(
                                                (hendelse: VedtaksfilUrl, id: number) => (
                                                    <StatusMessage key={id}>
                                                        <StatusMessageVedtak>
                                                            <EksternLenke
                                                                href={"" + hendelse.vedtaksfilUrl}
                                                                onClick={onVisVedtak}
                                                            >
                                                                Vedtak (
                                                                <DatoOgKlokkeslett
                                                                    bareDato={true}
                                                                    // TODO: Kan denne faktisk være null?
                                                                    tidspunkt={hendelse.dato!}
                                                                />
                                                                )
                                                            </EksternLenke>
                                                        </StatusMessageVedtak>
                                                    </StatusMessage>
                                                )
                                            )}
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
