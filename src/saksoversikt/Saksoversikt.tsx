import React, {useEffect} from "react";
import NavFrontendSpinner from "nav-frontend-spinner";
import "./saksoversikt.less";
import {InnsynAppState} from "../redux/reduxTypes";
import {useDispatch, useSelector} from "react-redux";
import {InnsynsdataSti, InnsynsdataType, Sakstype} from "../redux/innsynsdata/innsynsdataReducer";
import {REST_STATUS} from "../utils/restUtils";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import SaksoversiktDineSaker from "./SaksoversiktDineSaker";
import BigBanner from "../components/banner/BigBanner";
import useSoknadsSakerService from "./sakerFraSoknad/useSoknadsSakerService";
import {useBannerTittel} from "../redux/navigasjon/navigasjonUtils";
import {AlertStripeAdvarsel} from "nav-frontend-alertstriper";
import SaksoversiktIngenSoknader from "./SaksoversiktIngenSoknader";

const Saksoversikt: React.FC = () => {
    document.title = "Økonomisk sosialhjelp";

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

    useBannerTittel("Økonomisk sosialhjelp");
    console.log("leserData", leserData);
    console.log("mustlogin", mustLogin);
    console.log("innsynApi", innsynApiKommunikasjonsProblemer);
    console.log("soknadApi", soknadApiKommunikasjonsProblemer);

    return (
        <div className="informasjon-side">
            <BigBanner tittel="Økonomisk sosialhjelp" />
            <div className="blokk-center">
                {(!leserData || !mustLogin) && (innsynApiKommunikasjonsProblemer || soknadApiKommunikasjonsProblemer) && (
                    <AlertStripeAdvarsel className="luft_over_16px">
                        Vi klarte ikke å hente inn all informasjonen på siden.
                        <br />
                        Du kan forsøke å oppdatere siden, eller prøve igjen senere.
                    </AlertStripeAdvarsel>
                )}

                {(leserData || mustLogin) && (
                    <div className="application-spinner">
                        <NavFrontendSpinner type="XL" />
                    </div>
                )}

                {!leserData && !mustLogin && (
                    <>
                        {harSaker && <SaksoversiktDineSaker saker={alleSaker} />}
                        {!harSaker && <SaksoversiktIngenSoknader />}
                    </>
                )}
            </div>
        </div>
    );
};

export default Saksoversikt;
