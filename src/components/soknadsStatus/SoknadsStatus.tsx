import React from "react";
import { useTranslations } from "next-intl";
import { Alert, BodyShort, Label, Tag } from "@navikt/ds-react";
import styled from "styled-components";

import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import { logAmplitudeEvent, logButtonOrLinkClick } from "../../utils/amplitude";
import Lastestriper from "../lastestriper/Lasterstriper";
import EksternLenke from "../eksternLenke/EksternLenke";
import { useHentSoknadsStatus } from "../../generated/soknads-status-controller/soknads-status-controller";
import useFiksDigisosId from "../../hooks/useFiksDigisosIdDepricated";
import { useHentSaksStatuser } from "../../generated/saks-status-controller/saks-status-controller";
import {
    FilUrl,
    SaksStatusResponse,
    SaksStatusResponseStatus,
    SoknadsStatusResponseStatus,
} from "../../generated/model";
import styles from "../../styles/lists.module.css";

import SoknadsStatusTag from "./SoknadsStatusTag";
import SoknadsStatusPanel from "./SoknadsStatusPanel";

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

const StyledAlertTag = styled(Tag)`
    border-radius: 6px;
`;

const SoknadsStatus = () => {
    const fiksDigisosId = useFiksDigisosId();

    const soknadsStatusQuery = useHentSoknadsStatus(fiksDigisosId);
    const saksStatusQuery = useHentSaksStatuser(fiksDigisosId);
    const t = useTranslations("common");

    const soknadBehandlesIkke = soknadsStatusQuery.data?.status === SoknadsStatusResponseStatus.BEHANDLES_IKKE;
    const hasError = soknadsStatusQuery.isError || saksStatusQuery.isError;
    const isLoading = soknadsStatusQuery.isLoading || saksStatusQuery.isLoading;

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
                    <ul className={styles.saksList}>
                        {saksStatusQuery.data.map((statusdetalj: SaksStatusResponse, index: number) => {
                            const saksStatus = statusdetalj.status;
                            const sakIkkeInnsyn = saksStatus === SaksStatusResponseStatus.IKKE_INNSYN;
                            const sakBehandlesIkke = saksStatus === SaksStatusResponseStatus.BEHANDLES_IKKE;
                            if (statusdetalj.vedtaksfilUrlList && statusdetalj.vedtaksfilUrlList.length > 0) {
                                logAmplitudeEvent("Søker får vedtak");
                            }
                            logAmplitudeEvent("vedtak per sak", {
                                sak: index + 1,
                                antallVedtak: statusdetalj.vedtaksfilUrlList
                                    ? statusdetalj.vedtaksfilUrlList.length
                                    : 0,
                            });
                            return (
                                <li key={index}>
                                    <StatusBox>
                                        <StatusMessage>
                                            <Label as="p" lang="no">
                                                {hentSakstittel(statusdetalj.tittel)}
                                            </Label>
                                            {saksStatus === SaksStatusResponseStatus.FERDIGBEHANDLET && (
                                                <StyledAlertTag variant="success">
                                                    {t("saksStatus.ferdig_behandlet")}
                                                </StyledAlertTag>
                                            )}
                                            {saksStatus === SaksStatusResponseStatus.UNDER_BEHANDLING &&
                                                !soknadBehandlesIkke && (
                                                    <StyledAlertTag variant="warning">
                                                        {t("saksStatus.under_behandling")}
                                                    </StyledAlertTag>
                                                )}
                                        </StatusMessage>
                                        {sakBehandlesIkke && !soknadBehandlesIkke && (
                                            <BodyShort>{t("status.sak_behandles_ikke_ingress")}</BodyShort>
                                        )}
                                        {sakIkkeInnsyn && !soknadBehandlesIkke && (
                                            <BodyShort>{t("status.ikke_innsyn_ingress")}</BodyShort>
                                        )}
                                        {statusdetalj.vedtaksfilUrlList &&
                                            statusdetalj.vedtaksfilUrlList.map((hendelse: FilUrl, id: number) => (
                                                <StatusMessage key={id}>
                                                    <StatusMessageVedtak>
                                                        <EksternLenke
                                                            href={"" + hendelse.url}
                                                            onClick={() => logButtonOrLinkClick("Åpner et vedtak")}
                                                        >
                                                            {t("vedtak")} (
                                                            <DatoOgKlokkeslett
                                                                bareDato={true}
                                                                // TODO: Kan denne faktisk være null?
                                                                tidspunkt={hendelse.dato!}
                                                            />
                                                            )
                                                        </EksternLenke>
                                                    </StatusMessageVedtak>
                                                </StatusMessage>
                                            ))}
                                    </StatusBox>
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
