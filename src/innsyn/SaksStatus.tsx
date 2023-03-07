import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Heading, Panel} from "@navikt/ds-react";
import {InnsynAppState} from "../redux/reduxTypes";
import {REST_STATUS} from "../utils/restUtils";
import {hentInnsynsdata} from "../redux/innsynsdata/innsynsDataActions";
import {InnsynsdataActionTypeKeys, InnsynsdataSti, InnsynsdataType} from "../redux/innsynsdata/innsynsdataReducer";
import SoknadsStatus from "../components/soknadsStatus/SoknadsStatus";
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
import SoknadsStatusUtenInnsyn from "../components/soknadsStatus/SoknadsStatusUtenInnsyn";
import {logAmplitudeEvent} from "../utils/amplitude";
import {ApplicationSpinner} from "../components/applicationSpinner/ApplicationSpinner";
import styled from "styled-components";
import {setBreadcrumbs} from "../utils/breadcrumbs";
import {useLocation, useParams} from "react-router-dom";
import {LoadingResourcesFailedAlert} from "./LoadingResourcesFailedAlert";
import TimeoutBox from "../components/timeoutbox/TimeoutBox";
import useKommune from "../hooks/useKommune";

const StyledPanel = styled(Panel)`
    @media screen and (min-width: 641px) {
        padding-left: 80px;
        padding-right: 80px;
    }
`;

const SaksStatusView = () => {
    const {soknadId} = useParams();
    if (!soknadId) {
        throw new Error("mangler soknadId i urls");
    }
    const fiksDigisosId: string = soknadId;
    const innsynsdata: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);
    const innsynRestStatus = innsynsdata.restStatus.saksStatus;
    const {t} = useTranslation();

    const {kommune} = useKommune();
    const erPaInnsyn = !kommune?.erInnsynDeaktivert && !kommune?.erInnsynMidlertidigDeaktivert;
    const restStatus = innsynsdata.restStatus;
    const dispatch = useDispatch();
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    const dataErKlare =
        !pageLoadIsLogged &&
        erPaInnsyn &&
        restStatus.saksStatus === REST_STATUS.OK &&
        restStatus.oppgaver === REST_STATUS.OK &&
        restStatus.soknadsStatus === REST_STATUS.OK &&
        restStatus.forelopigSvar === REST_STATUS.OK;

    const {pathname} = useLocation();
    useEffect(() => {
        setBreadcrumbs({title: "Status på søknaden din", url: `/sosialhjelp${pathname}`});
    }, [pathname]);

    useEffect(() => {
        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SAKSSTATUS, true));
    }, [dispatch, fiksDigisosId]);

    useEffect(() => {
        function createAmplitudeData() {
            const harVedtaksbrev =
                innsynsdata.saksStatus && innsynsdata.saksStatus.some((item) => item.vedtaksfilUrlList?.length > 0);

            return {
                antallSaker: innsynsdata.saksStatus.length,
                harMottattForelopigSvar: innsynsdata.forelopigSvar.harMottattForelopigSvar,
                harEtterspurtDokumentasjon: innsynsdata.oppgaver.length > 0,
                harVedtaksbrev: harVedtaksbrev,
                status: innsynsdata.soknadsStatus.status,
            };
        }

        if (dataErKlare) {
            logAmplitudeEvent("Hentet saker for søknad", createAmplitudeData());
            //Ensure only one logging to amplitude
            setPageLoadIsLogged(true);
        }
    }, [
        dataErKlare,
        innsynsdata.oppgaver.length,
        innsynsdata.forelopigSvar.harMottattForelopigSvar,
        innsynsdata.saksStatus,
        innsynsdata.soknadsStatus.status,
    ]);

    useEffect(() => {
        dispatch({
            type: InnsynsdataActionTypeKeys.SETT_FIKSDIGISOSID,
            fiksDigisosId: fiksDigisosId,
        });
    }, [dispatch, fiksDigisosId]);

    useEffect(() => {
        if (innsynsdata.restStatus.saksStatus !== REST_STATUS.PENDING) {
            [
                InnsynsdataSti.OPPGAVER,
                InnsynsdataSti.VILKAR,
                InnsynsdataSti.DOKUMENTASJONKRAV,
                InnsynsdataSti.SOKNADS_STATUS,
                InnsynsdataSti.HENDELSER,
                InnsynsdataSti.VEDLEGG,
                InnsynsdataSti.FORELOPIG_SVAR,
                InnsynsdataSti.KOMMUNE,
            ].map((restDataSti: InnsynsdataSti) => dispatch(hentInnsynsdata(fiksDigisosId, restDataSti, false)));
        }
    }, [dispatch, fiksDigisosId, innsynsdata.restStatus.saksStatus]);

    const mustLogin: boolean = innsynRestStatus === REST_STATUS.UNAUTHORIZED;

    const statusTittel = "Status på søknaden din";
    document.title = `${statusTittel} - Økonomisk sosialhjelp`;

    useBannerTittel(statusTittel);

    const getHotjarTriggerIfValid = () => {
        const shouldShowHotjarTrigger =
            restStatus.soknadsStatus === REST_STATUS.OK &&
            restStatus.kommune === REST_STATUS.OK &&
            (innsynsdata.soknadsStatus.tidspunktSendt == null || innsynsdata.soknadsStatus.soknadsalderIMinutter > 60);
        if (!shouldShowHotjarTrigger) return null;
        if (isKommuneMedInnsyn(kommune, innsynsdata.soknadsStatus.status)) return "digisos_innsyn";
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

                    {!erPaInnsyn && (
                        <SoknadsStatusUtenInnsyn
                            restStatus={restStatus.soknadsStatus}
                            tidspunktSendt={innsynsdata.soknadsStatus.tidspunktSendt}
                            navKontor={innsynsdata.soknadsStatus.navKontor}
                            filUrl={innsynsdata.soknadsStatus.filUrl}
                        />
                    )}

                    {erPaInnsyn && (
                        <SoknadsStatus
                            soknadsStatus={innsynsdata.soknadsStatus.status}
                            sak={innsynsdata.saksStatus}
                            restStatus={restStatus.soknadsStatus}
                        />
                    )}

                    {(erPaInnsyn || innsynsdata.oppgaver.length > 0) && <Oppgaver />}

                    {kommune != null && kommune.erInnsynDeaktivert && (
                        <>
                            <StyledPanel className="panel-luft-over">
                                <Heading level="2" size="medium">
                                    {t("vedlegg.tittel")}
                                </Heading>
                            </StyledPanel>
                            <StyledPanel className="panel-glippe-over">
                                <VedleggView vedlegg={innsynsdata.vedlegg} restStatus={restStatus.vedlegg} />
                            </StyledPanel>
                        </>
                    )}
                    {(kommune == null || !kommune.erInnsynDeaktivert) && (
                        <ArkfanePanel
                            historikkChildren={<Historikk fiksDigisosId={fiksDigisosId} />}
                            vedleggChildren={
                                <VedleggView vedlegg={innsynsdata.vedlegg} restStatus={restStatus.vedlegg} />
                            }
                        />
                    )}
                </>
            )}
            <TimeoutBox sessionDurationInMinutes={30} showWarningerAfterMinutes={25} />
        </>
    );
};

export default SaksStatusView;
