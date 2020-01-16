import React, {useEffect} from "react";
import {Panel} from "nav-frontend-paneler";
import "./saksoversikt.less";
import {InnsynAppState} from "../redux/reduxTypes";
import {useDispatch, useSelector} from "react-redux";
import SaksoversiktIngenSoknader from "./SaksoversiktIngenSoknader";
import {InnsynsdataSti, InnsynsdataType, Sakstype} from "../redux/innsynsdata/innsynsdataReducer";
import {REST_STATUS} from "../utils/restUtils";
import Lastestriper from "../components/lastestriper/Lasterstriper";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import SaksoversiktDineSaker from "./SaksoversiktDineSaker";
import BigBanner from "../components/banner/BigBanner";
import useSoknadsSakerService from "./sakerFraSoknad/useSoknadsSakerService";
import {useBannerTittel } from "../redux/navigasjon/navigasjonUtils";

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
    let alleSaker: Sakstype[] = saker;
    if(!leserData) {
        if(sakerFraSoknadResponse.restStatus === REST_STATUS.OK) {
            alleSaker = saker.concat(sakerFraSoknadResponse.payload.results);
        }
    }
    const harSaker = alleSaker.length > 0;

    useEffect(() => {
        dispatch(hentSaksdata(InnsynsdataSti.SAKER))
    }, [dispatch]);

    useBannerTittel("Økonomisk sosialhjelp");

    return (
        <div className="informasjon-side">
            <BigBanner tittel="Økonomisk sosialhjelp"/>

            <div className="blokk-center">

                {leserData && (
                    <Panel style={{paddingTop: "2rem", marginTop: "2rem", paddingBottom: "2rem"}}>
                        <Lastestriper linjer={3}/>
                    </Panel>
                )}

                {!leserData && (
                    <>
                        {!harSaker && (
                            <SaksoversiktIngenSoknader/>
                        )}
                        {harSaker && (
                            <SaksoversiktDineSaker saker={alleSaker}/>
                         )}
                    </>
                )}
            </div>
        </div>
    )
};

export default Saksoversikt;
