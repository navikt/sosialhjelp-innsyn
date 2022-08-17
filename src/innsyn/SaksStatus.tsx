import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Heading, Panel} from "@navikt/ds-react";
import {InnsynAppState} from "../redux/reduxTypes";
import {fetchToJson, REST_STATUS} from "../utils/restUtils";
import {hentInnsynsdata} from "../redux/innsynsdata/innsynsDataActions";
import {
    hentDialogStatus,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    InnsynsdataType,
    KommuneResponse,
} from "../redux/innsynsdata/innsynsdataReducer";
import SoknadsStatus from "../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../components/oppgaver/Oppgaver";
import Historikk from "../components/historikk/Historikk";
import ArkfanePanel from "../components/arkfanePanel/ArkfanePanel";
import VedleggView from "../components/vedlegg/VedleggView";
import {FormattedMessage} from "react-intl";
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
import {useLocation} from "react-router";
import {LoadingResourcesFailedAlert} from "./LoadingResourcesFailedAlert";
import MeldingstjenesteInfo, {
    getVisMeldingsInfo,
    useLocalStorageState,
} from "../components/meldingstjenesteInfo/MeldingstjenesteInfo";
import "../components/meldingstjenesteInfo/sticky.css";
import {Portal} from "../components/meldingstjenesteInfo/Portal";

const StyledPanel = styled(Panel)`
    @media screen and (min-width: 641px) {
        padding-left: 80px;
        padding-right: 80px;
    }
`;

interface Props {
    match: {
        params: {
            soknadId: string;
        };
    };
}

const SaksStatusView: React.FC<Props> = ({match}) => {
    const fiksDigisosId: string = match.params.soknadId;
    const innsynsdata: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);
    const innsynRestStatus = innsynsdata.restStatus.saksStatus;

    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const erPaInnsyn = !kommuneResponse?.erInnsynDeaktivert && !kommuneResponse?.erInnsynMidlertidigDeaktivert;
    const restStatus = innsynsdata.restStatus;
    const dispatch = useDispatch();
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    const [loadingResourcesFailed, setLoadingResourcesFailed] = useState(false);
    const [harLukketMeldingsInfo, setHarLukketMeldingsInfo] = useLocalStorageState("harLukketMeldingsInfo", "false");
    const visMeldingsInfo = getVisMeldingsInfo(innsynsdata.dialogStatus, harLukketMeldingsInfo as "true" | "false");
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

            const saksStatuser = innsynsdata.saksStatus?.map((item) => item.status);

            return {
                antallSaker: innsynsdata.saksStatus.length,
                harMottattForelopigSvar: innsynsdata.forelopigSvar.harMottattForelopigSvar,
                harEtterspurtDokumentasjon: innsynsdata.oppgaver.length > 0,
                harVedtaksbrev: harVedtaksbrev,
                status: innsynsdata.soknadsStatus.status,
                saksStatuser: saksStatuser,
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

    useEffect(() => {
        if (!innsynsdata.dialogStatus) {
            fetchToJson("/innsyn/dialogstatus").then((verdi: any) => dispatch(hentDialogStatus(verdi)));
        }
    }, [dispatch, innsynsdata.dialogStatus]);

    const mustLogin: boolean = innsynRestStatus === REST_STATUS.UNAUTHORIZED;

    const statusTittel = "Status på søknaden din";
    document.title = `${statusTittel} - Økonomisk sosialhjelp`;

    useBannerTittel(statusTittel);

    const getHotjarTriggerIfValid = () => {
        const shouldShowHotjarTrigger =
            restStatus.soknadsStatus === REST_STATUS.OK &&
            restStatus.kommune === REST_STATUS.OK &&
            !visMeldingsInfo &&
            (innsynsdata.soknadsStatus.tidspunktSendt == null || innsynsdata.soknadsStatus.soknadsalderIMinutter > 60);
        if (!shouldShowHotjarTrigger) return null;
        if (isKommuneMedInnsyn(kommuneResponse, innsynsdata.soknadsStatus.status)) return "digisos_innsyn";
        if (isKommuneUtenInnsyn(kommuneResponse)) return "digisos_ikke_innsyn";
    };

    return (
        <>
            <LoadingResourcesFailedAlert
                loadingResourcesFailed={loadingResourcesFailed}
                setLoadingResourcesFailed={setLoadingResourcesFailed}
            />

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

                    {kommuneResponse != null && kommuneResponse.erInnsynDeaktivert && (
                        <>
                            <StyledPanel className="panel-luft-over">
                                <Heading level="2" size="medium">
                                    <FormattedMessage id="vedlegg.tittel" />
                                </Heading>
                            </StyledPanel>
                            <StyledPanel className="panel-glippe-over">
                                <VedleggView vedlegg={innsynsdata.vedlegg} restStatus={restStatus.vedlegg} />
                            </StyledPanel>
                        </>
                    )}
                    {(kommuneResponse == null || !kommuneResponse.erInnsynDeaktivert) && (
                        <ArkfanePanel
                            historikkChildren={
                                <Historikk hendelser={innsynsdata.hendelser} restStatus={restStatus.hendelser} />
                            }
                            vedleggChildren={
                                <VedleggView vedlegg={innsynsdata.vedlegg} restStatus={restStatus.vedlegg} />
                            }
                        />
                    )}
                    {visMeldingsInfo && (
                        <Portal className="stickyElement">
                            <MeldingstjenesteInfo lukkInfo={() => setHarLukketMeldingsInfo("true")} />
                        </Portal>
                    )}
                </>
            )}
        </>
    );
};

export default SaksStatusView;
