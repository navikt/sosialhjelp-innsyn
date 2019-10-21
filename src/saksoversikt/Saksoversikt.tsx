import React, {useEffect} from "react";
import {Panel} from "nav-frontend-paneler";
import "./saksoversikt.less";
import {InnsynAppState} from "../redux/reduxTypes";
import {useDispatch, useSelector} from "react-redux";
import SaksoversiktIngenSoknader from "./SaksoversiktIngenSoknader";
import {InnsynsdataSti, InnsynsdataType} from "../redux/innsynsdata/innsynsdataReducer";
import {REST_STATUS} from "../utils/restUtils";
import Lastestriper from "../components/lastestriper/Lasterstriper";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import SaksoversiktDineSaker from "./SaksoversiktDineSaker";
import {setBrodsmuleSti} from "../redux/navigasjon/navigasjonsReducer";
import BrodsmuleSti from "../components/brodsmuleSti/BrodsmuleSti";
import Head from "../components/ikoner/Head";

const Saksoversikt: React.FC = () => {
    const dispatch = useDispatch();
    const innsynsdata: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);
    const restStatus = innsynsdata.restStatus.saker;
    const leserData: boolean = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const saker = innsynsdata.saker;
    const harSaker = saker.length > 0;

    useEffect(() => {
        dispatch(hentSaksdata(InnsynsdataSti.SAKER))
    }, [dispatch]);

    useEffect(() => {
        dispatch(setBrodsmuleSti([
                {sti: "/sosialhjelp/innsyn", tittel: "Økonomisk sosialhjelp"}
            ]))
    }, [dispatch]);

    return (
        <div className="informasjon-side">
            <div className="big_banner">
                <div className="blokk-center">
                    <div className="big_banner__brodsmuler"><span className="big_banner__brodsmuler__head"><Head/></span><BrodsmuleSti/></div>
                    <h1 className="big_banner__tittel">
                        Økonomisk sosialhjelp
                    </h1>
                </div>
            </div>

            <div className="blokk-center">

                {leserData && (
                    <Panel style={{paddingTop: "2rem", paddingBottom: "2rem"}}>
                        <Lastestriper linjer={3}/>
                    </Panel>
                )}

                {!leserData && (
                    <>
                        {!harSaker && (
                            <SaksoversiktIngenSoknader/>
                        )}
                        {harSaker && (
                            <SaksoversiktDineSaker saker={saker} />
                         )}
                    </>
                )}
            </div>
        </div>
    )
};

export default Saksoversikt;
