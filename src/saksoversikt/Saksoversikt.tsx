import React, {useEffect, useState} from "react";
import NavFrontendSpinner from "nav-frontend-spinner";
import "./saksoversikt.less";
import {InnsynAppState} from "../redux/reduxTypes";
import {useDispatch, useSelector} from "react-redux";
import {InnsynsdataSti, InnsynsdataType, Sakstype, settSisteKommune} from "../redux/innsynsdata/innsynsdataReducer";
import {fetchToJson, REST_STATUS} from "../utils/restUtils";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import SaksoversiktDineSaker from "./SaksoversiktDineSaker";
import BigBanner from "../components/banner/BigBanner";
import useSoknadsSakerService from "./sakerFraSoknad/useSoknadsSakerService";
import {useBannerTittel} from "../redux/navigasjon/navigasjonUtils";
import {AlertStripeAdvarsel} from "nav-frontend-alertstriper";
import SaksoversiktIngenSoknader from "./SaksoversiktIngenSoknader";
import {Normaltekst} from "nav-frontend-typografi";
import {logAmplitudeEvent} from "../utils/amplitude";
import Lenkepanel from "nav-frontend-lenkepanel";
import styled from "styled-components";

const StyledLenkepanel = styled(Lenkepanel)`
    .lenkepanel__heading {
        margin-bottom: 0px;
    }
`;

const Saksoversikt: React.FC = () => {
    document.title = "Dine søknader - Økonomisk sosialhjelp";
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    const dispatch = useDispatch();
    const innsynData: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);
    const innsynRestStatus = innsynData.restStatus.saker;
    const leserInnsynData: boolean =
        innsynRestStatus === REST_STATUS.INITIALISERT || innsynRestStatus === REST_STATUS.PENDING;

    const soknadApiData = useSoknadsSakerService();
    const leserSoknadApiData: boolean =
        soknadApiData.restStatus === REST_STATUS.INITIALISERT || soknadApiData.restStatus === REST_STATUS.PENDING;

    const leserData: boolean = leserInnsynData || leserSoknadApiData;
    const mustLogin: boolean = innsynRestStatus === REST_STATUS.UNAUTHORIZED;

    let innsynApiKommunikasjonsProblemer = false;
    let soknadApiKommunikasjonsProblemer = false;

    const kommunenavn = useSelector((state: InnsynAppState) => state.innsynsdata.sisteKommune);

    let alleSaker: Sakstype[] = [];
    if (!leserData) {
        if (innsynRestStatus === REST_STATUS.OK) {
            alleSaker = alleSaker.concat(innsynData.saker);
        }
        if (soknadApiData.restStatus === REST_STATUS.OK) {
            alleSaker = alleSaker.concat(soknadApiData.payload.results);
        }
        if (innsynRestStatus === REST_STATUS.SERVICE_UNAVAILABLE || innsynRestStatus === REST_STATUS.FEILET) {
            innsynApiKommunikasjonsProblemer = true;
        }
        if (soknadApiData.restStatus === REST_STATUS.FEILET) {
            soknadApiKommunikasjonsProblemer = true;
        }
    }
    const harSaker = alleSaker.length > 0;

    useEffect(() => {
        dispatch(hentSaksdata(InnsynsdataSti.SAKER, false));
    }, [dispatch]);

    useEffect(() => {
        fetchToJson("/innsyn/sisteKommune")
            .then((sak: any) => dispatch(settSisteKommune(sak.kommunenummer)))
            .catch((e) => console.error("error", e));
    }, [dispatch]);

    useEffect(() => {
        if (!pageLoadIsLogged && innsynRestStatus === REST_STATUS.OK && soknadApiData.restStatus === REST_STATUS.OK) {
            logAmplitudeEvent("Hentet innsynsdata", {
                antallSoknader: alleSaker.length,
            });
            //Ensure only one logging to amplitude
            setPageLoadIsLogged(true);
        }
    }, [innsynRestStatus, soknadApiData.restStatus, alleSaker.length, pageLoadIsLogged]);

    useBannerTittel("Økonomisk sosialhjelp");

    return (
        <div className="informasjon-side">
            <BigBanner tittel="Økonomisk sosialhjelp" />
            <div className="blokk-center">
                {(leserData || mustLogin) && (
                    <div className="application-spinner">
                        <NavFrontendSpinner type="XL" />
                    </div>
                )}
                {!leserData && !mustLogin && (
                    <>
                        {(innsynApiKommunikasjonsProblemer || soknadApiKommunikasjonsProblemer) && (
                            <AlertStripeAdvarsel className="luft_over_16px">
                                <Normaltekst>Vi klarte ikke å hente inn all informasjonen på siden.</Normaltekst>
                                <Normaltekst>Du kan forsøke å oppdatere siden, eller prøve igjen senere.</Normaltekst>
                            </AlertStripeAdvarsel>
                        )}
                        {kommunenavn.length > 0 && (
                            <StyledLenkepanel
                                tittelProps={"element"}
                                border={false}
                                href="/sosialhjelp/innsyn/undersokelse"
                            >
                                Vil du hjelpe oss med å forbedre nettsidene for sosialhjelp?
                            </StyledLenkepanel>
                        )}
                        {harSaker ? <SaksoversiktDineSaker saker={alleSaker} /> : <SaksoversiktIngenSoknader />}
                    </>
                )}
            </div>
        </div>
    );
};

export default Saksoversikt;
