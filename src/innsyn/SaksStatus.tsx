import React, {useEffect, useState} from "react";
import {Heading, Panel} from "@navikt/ds-react";
import Oppgaver from "../components/oppgaver/Oppgaver";
import Historikk from "../components/historikk/Historikk";
import ArkfanePanel from "../components/arkfanePanel/ArkfanePanel";
import VedleggView from "../components/vedlegg/VedleggView";
import {useTranslation} from "react-i18next";
import ForelopigSvarAlertstripe from "../components/forelopigSvar/ForelopigSvar";
import DriftsmeldingAlertstripe from "../components/driftsmelding/Driftsmelding";
import {SoknadHotjarTrigger} from "../components/hotjarTrigger/HotjarTrigger";
import {isKommuneMedInnsyn, isKommuneUtenInnsyn} from "./saksStatusUtils";
import {useBannerTittel} from "../redux/navigasjon/navigasjonUtils";
import {logAmplitudeEvent} from "../utils/amplitude";
import {ApplicationSpinner} from "../components/applicationSpinner/ApplicationSpinner";
import styled from "styled-components";
import {setBreadcrumbs} from "../utils/breadcrumbs";
import {useLocation} from "react-router-dom";
import {LoadingResourcesFailedAlert} from "./LoadingResourcesFailedAlert";
import TimeoutBox from "../components/timeoutbox/TimeoutBox";
import useKommune from "../hooks/useKommune";
import SoknadsStatus from "../components/soknadsStatus/SoknadsStatus";
import {useGetOppgaver} from "../generated/oppgave-controller/oppgave-controller";
import useFiksDigisosId from "../hooks/useFiksDigisosId";
import {useHentSoknadsStatus} from "../generated/soknads-status-controller/soknads-status-controller";
import {useHentForelopigSvarStatus} from "../generated/forelopig-svar-controller/forelopig-svar-controller";
import {useHentSaksStatuser} from "../generated/saks-status-controller/saks-status-controller";
import {HttpStatusCode} from "axios";

const StyledPanel = styled(Panel)`
    @media screen and (min-width: 641px) {
        padding-left: 80px;
        padding-right: 80px;
    }
`;

const SaksStatusView = () => {
    const fiksDigisosId = useFiksDigisosId();
    const {t} = useTranslation();

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

    const {pathname} = useLocation();
    useEffect(() => {
        setBreadcrumbs({title: "Status på søknaden din", url: `/sosialhjelp${pathname}`});
    }, [pathname]);

    useEffect(() => {
        function createAmplitudeData() {
            const harVedtaksbrev = saksStatuser && saksStatuser.some((item) => item.vedtaksfilUrlList?.length);

            return {
                antallSaker: Boolean(saksStatuser?.length),
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

    const statusTittel = "Status på søknaden din";
    document.title = `${statusTittel} - Økonomisk sosialhjelp`;

    useBannerTittel(statusTittel);

    const getHotjarTriggerIfValid = () => {
        const shouldShowHotjarTrigger =
            soknadsStatus &&
            kommune &&
            (soknadsStatus.tidspunktSendt == null || (soknadsStatus.soknadsalderIMinutter ?? 0) > 60);
        if (!shouldShowHotjarTrigger) return null;
        if (isKommuneMedInnsyn(kommune, soknadsStatus.status)) return "digisos_innsyn";
        if (isKommuneUtenInnsyn(kommune)) return "digisos_ikke_innsyn";
    };

    return (
        <>
            <LoadingResourcesFailedAlert />

            <SoknadHotjarTrigger trigger={getHotjarTriggerIfValid()}>
                <div />
            </SoknadHotjarTrigger>

            {mustLogin && <ApplicationSpinner />}

            {!mustLogin && (
                <>
                    <DriftsmeldingAlertstripe />

                    <ForelopigSvarAlertstripe />

                    <SoknadsStatus />

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
                    {(kommune == null || !kommune.erInnsynDeaktivert) && (
                        <ArkfanePanel
                            historikkChildren={<Historikk fiksDigisosId={fiksDigisosId} />}
                            vedleggChildren={<VedleggView fiksDigisosId={fiksDigisosId} />}
                        />
                    )}
                </>
            )}
            <TimeoutBox sessionDurationInMinutes={30} showWarningerAfterMinutes={25} />
        </>
    );
};

export default SaksStatusView;
