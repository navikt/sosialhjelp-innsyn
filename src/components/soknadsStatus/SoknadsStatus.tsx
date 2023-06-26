import React from "react";
import EksternLenke from "../eksternLenke/EksternLenke";
import {useTranslation} from "react-i18next";
import Lastestriper from "../lastestriper/Lasterstriper";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Alert, BodyShort, Label, Tag} from "@navikt/ds-react";
import styled from "styled-components/macro";
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
import styles from "../../styles/lists.module.css";
import SoknadsStatusPanel from "./SoknadsStatusPanel";
import {ContentPanelBorder} from "./SoknadsStatusHeading";

const StyledAlert = styled(Alert)`
    margin-bottom: 1rem;
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

    const hentSakstittel = (tittel: string) => {
        return tittel && tittel !== "default_sak_tittel" ? tittel : t("default_sak_tittel");
    };

    if (isLoading) {
        return (
            <SoknadsStatusPanel hasError={false}>
                <Lastestriper linjer={1} />
            </SoknadsStatusPanel>
        );
    }
    if (hasError) {
        if (soknadsStatusQuery.isError) {
            return (
                <SoknadsStatusPanel hasError={true}>
                    <Alert variant="error" inline>
                        {t("feilmelding.soknadStatus_innlasting")}
                    </Alert>
                </SoknadsStatusPanel>
            );
        }

        if (saksStatusQuery.isError) {
            return (
                <SoknadsStatusPanel hasError={true} soknadsStatus={soknadsStatus}>
                    <Alert variant="error" inline>
                        {t("feilmelding.saksStatus_innlasting")}
                    </Alert>
                </SoknadsStatusPanel>
            );
        }
    }

    return (
        <SoknadsStatusPanel hasError={false} soknadsStatus={soknadsStatus}>
            <>
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

                {!hasError && saksStatusQuery.data && (
                    <ul className={styles.unorderedList}>
                        {saksStatusQuery.data.map((statusdetalj: SaksStatusResponse, index: number) => {
                            const saksStatus = statusdetalj.status;
                            const sakIkkeInnsyn = saksStatus === SaksStatusResponseStatus.IKKE_INNSYN;
                            const sakBehandlesIkke = saksStatus === SaksStatusResponseStatus.BEHANDLES_IKKE;

                            return (
                                <li key={index}>
                                    <StatusBox>
                                        <StatusMessage>
                                            <Label as="p">{hentSakstittel(statusdetalj.tittel)}</Label>
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
                                            <BodyShort>{t("status.sak_behandles_ikke_ingress")}</BodyShort>
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
                                </li>
                            );
                        })}
                    </ul>
                )}
            </>
        </SoknadsStatusPanel>
    );
};

export default SoknadsStatus;
