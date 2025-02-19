import styled from "styled-components";
import { Alert, BodyShort, Heading, Panel as NavDsPanel } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { logger } from "@navikt/next-logger";

import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import useKommune from "../../hooks/useKommune";
import { useHentSaksStatuser } from "../../generated/saks-status-controller/saks-status-controller";
import { useGetOppgaver } from "../../generated/oppgave-controller/oppgave-controller";
import { useHentSoknadsStatus } from "../../generated/soknads-status-controller/soknads-status-controller";
import { useHentForelopigSvarStatus } from "../../generated/forelopig-svar-controller/forelopig-svar-controller";
import { logAmplitudeEvent } from "../../utils/amplitude";
import { LoadingResourcesFailedAlert } from "../../innsyn/LoadingResourcesFailedAlert";
import { DriftsmeldingKommune } from "../../components/driftsmelding/DriftsmeldingKommune";
import ForelopigSvarAlertstripe from "../../components/forelopigSvar/ForelopigSvar";
import SoknadsStatus from "../../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../../components/oppgaver/Oppgaver";
import VedleggView from "../../components/vedlegg/VedleggView";
import Historikk from "../../components/historikk/Historikk";
import MainLayout from "../../components/MainLayout";
import useUpdateBreadcrumbs from "../../hooks/useUpdateBreadcrumbs";
import { FilUploadSuccesfulProvider } from "../../components/filopplasting/FilUploadSuccessfulContext";
import KlageSection from "../../components/klage/KlageSection";
import { SaksStatusResponseStatus, SoknadsStatusResponseStatus } from "../../generated/model";
import pageHandler from "../../pagehandler/pageHandler";
import Panel from "../../components/panel/Panel";
import EttersendelseView from "../../components/ettersendelse/EttersendelseView";
import { useHentVedlegg } from "../../generated/vedlegg-controller/vedlegg-controller";

const StyledPanel = styled(NavDsPanel)`
    @media screen and (min-width: 641px) {
        padding-left: 80px;
        padding-right: 80px;
    }
`;

const StyledSpace = styled.div`
    padding: 2rem 0 2rem 0;
`;

const StyledAlert = styled(Alert)`
    margin-bottom: 3rem;
`;

const SakStatus = ({ fiksDigisosId }: { fiksDigisosId: string }) => {
    const { t } = useTranslation();
    const pathname = usePathname();
    useUpdateBreadcrumbs(() => [{ title: t("soknadStatus.tittel"), url: `/sosialhjelp${pathname}` }]);

    const { kommune, driftsmelding } = useKommune();

    const erPaInnsyn = !kommune?.erInnsynDeaktivert && !kommune?.erInnsynMidlertidigDeaktivert;
    const { data: saksStatuser } = useHentSaksStatuser(fiksDigisosId);
    const { data: oppgaver } = useGetOppgaver(fiksDigisosId);
    const { data: soknadsStatus } = useHentSoknadsStatus(fiksDigisosId);
    const { data: forelopigSvar } = useHentForelopigSvarStatus(fiksDigisosId);
    const { isLoading } = useHentVedlegg(fiksDigisosId);

    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    const dataErKlare = Boolean(
        !pageLoadIsLogged && erPaInnsyn && saksStatuser && oppgaver && soknadsStatus && forelopigSvar
    );

    useEffect(() => {
        function createAmplitudeData() {
            const harVedtaksbrev = saksStatuser && saksStatuser.some((item) => item.vedtaksfilUrlList?.length);

            return {
                antallSaker: saksStatuser!.length,
                harMottattForelopigSvar: forelopigSvar?.harMottattForelopigSvar,
                harEtterspurtDokumentasjon: Boolean(oppgaver?.length),
                harVedtaksbrev: harVedtaksbrev,
                status: soknadsStatus?.status,
            };
        }

        if (dataErKlare) {
            logAmplitudeEvent("Hentet saker for søknad", createAmplitudeData());
            //Ensure only one logging to amplitude
            setPageLoadIsLogged(true);
        }
    }, [dataErKlare, oppgaver?.length, forelopigSvar?.harMottattForelopigSvar, saksStatuser, soknadsStatus?.status]);

    const sakErPaaklagbar =
        soknadsStatus?.status !== SoknadsStatusResponseStatus.BEHANDLES_IKKE &&
        (!saksStatuser ||
            saksStatuser?.some(
                (it) =>
                    it.status !== SaksStatusResponseStatus.BEHANDLES_IKKE &&
                    it.status !== SaksStatusResponseStatus.IKKE_INNSYN
            ));

    return (
        <MainLayout title={t("app.tittel")}>
            <StyledSpace />
            <LoadingResourcesFailedAlert />

            <DriftsmeldingKommune driftsmelding={driftsmelding} />

            {soknadsStatus?.isBroken && (
                <StyledAlert variant="warning">
                    <BodyShort>{t("soknaderUtenVedlegg.statusside")}</BodyShort>
                </StyledAlert>
            )}

            <ForelopigSvarAlertstripe />

            <SoknadsStatus />
            <FilUploadSuccesfulProvider>
                {erPaInnsyn && <Oppgaver />}
                {kommune != null && kommune.erInnsynDeaktivert && (
                    <>
                        <StyledPanel className="panel-luft-over">
                            <Heading level="2" size="medium">
                                {t("vedlegg.tittel")}
                            </Heading>
                        </StyledPanel>
                        <StyledPanel className="panel-glippe-over">
                            <VedleggView fiksDigisosId={fiksDigisosId} />
                        </StyledPanel>
                    </>
                )}
                {sakErPaaklagbar && <KlageSection />}
                {(kommune == null || !kommune.erInnsynDeaktivert) && (
                    <>
                        <Panel header={t("andre_vedlegg.type")}>
                            <EttersendelseView isLoading={isLoading} />
                        </Panel>
                        <Panel header="Dette har skjedd i saken din">
                            <Historikk fiksDigisosId={fiksDigisosId} />
                        </Panel>
                    </>
                )}
            </FilUploadSuccesfulProvider>
        </MainLayout>
    );
};

/**
 * Dette er en liten hack som forhindrer at en request mot en søknad bruker ikke
 * eier, fører til 20-30 mislykkede kall og loggstøy.
 */
const SaksStatusView: NextPage = () => {
    const fiksDigisosId = useFiksDigisosId();
    const { isPending, error } = useHentSoknadsStatus(fiksDigisosId);
    const router = useRouter();

    useEffect(() => {
        if (!error) return;
        logger.warn("Error fetching soknadsstatus", error);
        router.push("/");
    }, [error, router]);

    if (isPending) return null;

    return error ? null : <SakStatus fiksDigisosId={fiksDigisosId} />;
};

export const getServerSideProps: GetServerSideProps = pageHandler;

export default SaksStatusView;
