import React, {useEffect, useState} from "react";
import {Alert, BodyShort, LinkPanel} from "@navikt/ds-react";
import "./saksoversikt.css";
import {InnsynAppState} from "../redux/reduxTypes";
import {useDispatch, useSelector} from "react-redux";
import {
    hentDialogStatus,
    InnsynsdataSti,
    InnsynsdataType,
    Sakstype,
    settSisteKommune,
} from "../redux/innsynsdata/innsynsdataReducer";
import {fetchToJson, REST_STATUS} from "../utils/restUtils";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import SaksoversiktDineSaker from "./SaksoversiktDineSaker";
import BigBanner from "../components/banner/BigBanner";
import {useBannerTittel} from "../redux/navigasjon/navigasjonUtils";
import SaksoversiktIngenSoknader from "./SaksoversiktIngenSoknader";
import {logAmplitudeEvent} from "../utils/amplitude";
import styled from "styled-components";
import {useCookies} from "react-cookie";
import DineMeldingerPanel from "./meldinger/DineMeldingerPanel";
import {ApplicationSpinner} from "../components/applicationSpinner/ApplicationSpinner";
import {setBreadcrumbs} from "../utils/breadcrumbs";

const StyledLinkPanel = styled(LinkPanel)`
    margin-top: 1rem;
`;

const KOMMUNENUMMER_I_UNDERSOKELSE = ["0301", "3411", "5001"];

const Saksoversikt: React.FC = () => {
    document.title = "Dine søknader - Økonomisk sosialhjelp";
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    const dispatch = useDispatch();
    const innsynData: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);
    const restStatus = innsynData.restStatus.saker;
    const leserData: boolean = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;

    const mustLogin: boolean = restStatus === REST_STATUS.UNAUTHORIZED;

    let innsynApiKommunikasjonsProblemer = false;

    const [cookies] = useCookies(["sosialhjelp-meldinger-undersokelse"]);

    const kommunenummer = useSelector((state: InnsynAppState) => state.innsynsdata.sisteKommune);

    let alleSaker: Sakstype[] = [];
    if (!leserData) {
        if (restStatus === REST_STATUS.OK) {
            alleSaker = alleSaker.concat(innsynData.saker);
        }
        if (restStatus === REST_STATUS.SERVICE_UNAVAILABLE || restStatus === REST_STATUS.FEILET) {
            innsynApiKommunikasjonsProblemer = true;
        }
    }
    const harSaker = alleSaker.length > 0;

    useEffect(() => {
        setBreadcrumbs();
    }, []);

    useEffect(() => {
        dispatch(hentSaksdata(InnsynsdataSti.SAKER, false));
    }, [dispatch]);

    useEffect(() => {
        fetchToJson("/innsyn/sisteSak").then((sak: any) => dispatch(settSisteKommune(sak?.kommunenummer)));
    }, [dispatch]);

    useEffect(() => {
        fetchToJson("/innsyn/dialogstatus").then((verdi: any) => dispatch(hentDialogStatus(verdi)));
    }, [dispatch]);

    useEffect(() => {
        if (!pageLoadIsLogged && restStatus === REST_STATUS.OK) {
            logAmplitudeEvent("Hentet innsynsdata", {
                antallSoknader: alleSaker.length,
            });
            //Ensure only one logging to amplitude
            setPageLoadIsLogged(true);
        }
    }, [restStatus, alleSaker.length, pageLoadIsLogged]);

    useBannerTittel("Økonomisk sosialhjelp");

    return (
        <div className="informasjon-side">
            <BigBanner tittel="Økonomisk sosialhjelp" />
            <div className="blokk-center">
                {(leserData || mustLogin) && <ApplicationSpinner />}
                {!leserData && !mustLogin && (
                    <>
                        {innsynApiKommunikasjonsProblemer && (
                            <Alert variant="warning" className="luft_over_16px">
                                <BodyShort>Vi klarte ikke å hente inn all informasjonen på siden.</BodyShort>
                                <BodyShort>Du kan forsøke å oppdatere siden, eller prøve igjen senere.</BodyShort>
                            </Alert>
                        )}
                        {kommunenummer.length > 0 &&
                            innsynData.dialogStatus?.tilgangTilDialog === false &&
                            !cookies["sosialhjelp-meldinger-undersokelse"] &&
                            KOMMUNENUMMER_I_UNDERSOKELSE.includes(kommunenummer) && (
                                <StyledLinkPanel
                                    tittelProps={"element"}
                                    border={false}
                                    href="/sosialhjelp/innsyn/undersokelse"
                                >
                                    Vil du hjelpe oss med å forbedre nettsidene for sosialhjelp?
                                </StyledLinkPanel>
                            )}
                        {innsynData.dialogStatus?.tilgangTilDialog && <DineMeldingerPanel />}
                        {harSaker ? <SaksoversiktDineSaker saker={alleSaker} /> : <SaksoversiktIngenSoknader />}
                    </>
                )}
            </div>
        </div>
    );
};

export default Saksoversikt;
