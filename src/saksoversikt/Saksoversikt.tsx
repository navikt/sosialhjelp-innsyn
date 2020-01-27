import React, {useEffect} from "react";
import NavFrontendSpinner from "nav-frontend-spinner";
import "./saksoversikt.less";
import {InnsynAppState} from "../redux/reduxTypes";
import {useDispatch, useSelector} from "react-redux";
import SaksoversiktIngenSoknader from "./SaksoversiktIngenSoknader";
import {InnsynsdataSti, InnsynsdataType, Sakstype, skalViseFeilside} from "../redux/innsynsdata/innsynsdataReducer";
import {REST_STATUS} from "../utils/restUtils";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import SaksoversiktDineSaker from "./SaksoversiktDineSaker";
import BigBanner from "../components/banner/BigBanner";
import useSoknadsSakerService from "./sakerFraSoknad/useSoknadsSakerService";
import {useBannerTittel} from "../redux/navigasjon/navigasjonUtils";
import {AlertStripeFeil} from "nav-frontend-alertstriper";
import {HarSakerFraInnsynHotjarTrigger} from "../components/hotjarTrigger/HotjarTrigger";

const Saksoversikt: React.FC = () => {
    document.title = "Økonomisk sosialhjelp";

    const dispatch = useDispatch();
    const innsynsdata: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);
    const restStatus = innsynsdata.restStatus.saker;
    const saker:Sakstype[] = innsynsdata.saker;
    const sakerFraSoknadResponse = useSoknadsSakerService();
    const leserSaksData: boolean = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const leserSoknadSaksData: boolean = sakerFraSoknadResponse.restStatus === REST_STATUS.INITIALISERT || sakerFraSoknadResponse.restStatus === REST_STATUS.PENDING;
    const leserData: boolean = leserSaksData || leserSoknadSaksData;
    const mustLogin: boolean = restStatus === REST_STATUS.UNAUTHORIZED;
    let fiksKommunikasjonsProblemer = false;
    let soknadKommunikasjonsProblemer = false;
    let alleSaker: Sakstype[] = saker;
    if(!leserData) {
        if(sakerFraSoknadResponse.restStatus === REST_STATUS.OK) {
            alleSaker = saker.concat(sakerFraSoknadResponse.payload.results);
        }
        if(restStatus === REST_STATUS.SERVICE_UNAVAILABLE) {
            fiksKommunikasjonsProblemer = true;
        }
        if(sakerFraSoknadResponse.restStatus === REST_STATUS.FEILET) {
            soknadKommunikasjonsProblemer = true;
            if(fiksKommunikasjonsProblemer) {
                if(!innsynsdata.skalViseFeilside) {
                    dispatch(skalViseFeilside(true));
                }
            }
        }
    }
    const harSaker = alleSaker.length > 0;
    const harSakerFraInnsyn = saker.length > 0;

    useEffect(() => {
        dispatch(hentSaksdata(InnsynsdataSti.SAKER))
    }, [dispatch]);

    useBannerTittel("Økonomisk sosialhjelp");

    return (
        <div className="informasjon-side">
            <BigBanner tittel="Økonomisk sosialhjelp"/>

            <div className="blokk-center">

                {leserData || mustLogin && (
                    <div className="application-spinner">
                        <NavFrontendSpinner type="XL"/>
                    </div>
                )}

                {!leserData && !mustLogin && (
                    <>
                        {(fiksKommunikasjonsProblemer || soknadKommunikasjonsProblemer) &&
                            <AlertStripeFeil className="luft_over_2rem">Problemer med å hente søknader fra alle våre kilder.
                                Det kan hende at du har flere søknader enn det som vises her!</AlertStripeFeil>
                        }
                        {!harSaker && (
                            <SaksoversiktIngenSoknader/>
                        )}
                        {(harSaker && harSakerFraInnsyn) && (
                            <HarSakerFraInnsynHotjarTrigger>
                                <SaksoversiktDineSaker saker={alleSaker}/>
                            </HarSakerFraInnsynHotjarTrigger>
                         )}
                        {(harSaker && !harSakerFraInnsyn) && (
                            <SaksoversiktDineSaker saker={alleSaker}/>
                        )}
                    </>
                )}
            </div>
        </div>
    )
};

export default Saksoversikt;
