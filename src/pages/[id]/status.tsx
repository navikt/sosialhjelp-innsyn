import styled from "styled-components";
import {Heading, Panel} from "@navikt/ds-react";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import {useTranslation} from "next-i18next";
import useKommune from "../../hooks/useKommune";
import {useHentSaksStatuser} from "../../generated/saks-status-controller/saks-status-controller";
import {useGetOppgaver} from "../../generated/oppgave-controller/oppgave-controller";
import {useHentSoknadsStatus} from "../../generated/soknads-status-controller/soknads-status-controller";
import {useHentForelopigSvarStatus} from "../../generated/forelopig-svar-controller/forelopig-svar-controller";
import React, {useEffect, useState} from "react";
import {logAmplitudeEvent} from "../../utils/amplitude";
import {HttpStatusCode} from "axios";
import {LoadingResourcesFailedAlert} from "../../innsyn/LoadingResourcesFailedAlert";
import {ApplicationSpinner} from "../../components/applicationSpinner/ApplicationSpinner";
import DriftsmeldingAlertstripe from "../../components/driftsmelding/Driftsmelding";
import ForelopigSvarAlertstripe from "../../components/forelopigSvar/ForelopigSvar";
import SoknadsStatus from "../../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../../components/oppgaver/Oppgaver";
import VedleggView from "../../components/vedlegg/VedleggView";
import ArkfanePanel from "../../components/arkfanePanel/ArkfanePanel";
import Historikk from "../../components/historikk/Historikk";
import TimeoutBox from "../../components/timeoutbox/TimeoutBox";
import {usePathname} from "next/navigation";
import MainLayout from "../../components/MainLayout";
import {GetServerSideProps, NextPage} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import useUpdateBreadcrumbs from "../../hooks/useUpdateBreadcrumbs";
import {FilUploadSuccesfulProvider} from "../../components/filopplasting/FilUploadSuccessfulContext";
import KlageSection from "../../components/klage/KlageSection";
import {SaksStatusResponseStatus, SoknadsStatusResponseStatus} from "../../generated/model";

const StyledPanel = styled(Panel)`
    @media screen and (min-width: 641px) {
        padding-left: 80px;
        padding-right: 80px;
    }
`;

const SaksStatusView: NextPage = () => {
    const fiksDigisosId = useFiksDigisosId();
    const {t} = useTranslation();
    const pathname = usePathname();
    useUpdateBreadcrumbs(() => [{title: t("soknadStatus.tittel"), url: `/sosialhjelp${pathname}`}]);

    const {kommune} = useKommune();

    const erPaInnsyn = !kommune?.erInnsynDeaktivert && !kommune?.erInnsynMidlertidigDeaktivert;
    const {data: saksStatuser, error: saksStatuserError} = useHentSaksStatuser(fiksDigisosId);
    const {data: oppgaver} = useGetOppgaver(fiksDigisosId);
    const {data: soknadsStatus} = useHentSoknadsStatus(fiksDigisosId);
    const {data: forelopigSvar} = useHentForelopigSvarStatus(fiksDigisosId);

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

    const mustLogin: boolean = saksStatuserError?.status === HttpStatusCode.Unauthorized;

    const sakErPaaklagbar =
        soknadsStatus?.status !== SoknadsStatusResponseStatus.BEHANDLES_IKKE &&
        (!saksStatuser ||
            saksStatuser?.some(
                (it) =>
                    it.status !== SaksStatusResponseStatus.BEHANDLES_IKKE &&
                    it.status !== SaksStatusResponseStatus.IKKE_INNSYN
            ));

    return (
        <MainLayout title={`${t("soknadStatus.tittel")} - ${t("app.tittel")}`} bannerTitle={t("soknadStatus.tittel")}>
            <LoadingResourcesFailedAlert />

            {mustLogin && <ApplicationSpinner />}

            {!mustLogin && (
                <>
                    <DriftsmeldingAlertstripe />

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
                            <ArkfanePanel
                                historikkChildren={<Historikk fiksDigisosId={fiksDigisosId} />}
                                vedleggChildren={<VedleggView fiksDigisosId={fiksDigisosId} />}
                            />
                        )}
                    </FilUploadSuccesfulProvider>
                </>
            )}
            <TimeoutBox sessionDurationInMinutes={30} showWarningerAfterMinutes={25} />
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
    const translations = await serverSideTranslations(locale ?? "nb", ["common"]);
    return {props: {...translations}};
};

export default SaksStatusView;
