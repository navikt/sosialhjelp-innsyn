import React, {useEffect, useState} from "react";
import {Alert, BodyShort} from "@navikt/ds-react";
import "./saksoversikt.css";
import {InnsynAppState} from "../redux/reduxTypes";
import {useDispatch, useSelector} from "react-redux";
import {InnsynsdataSti, InnsynsdataType, Sakstype} from "../redux/innsynsdata/innsynsdataReducer";
import {REST_STATUS} from "../utils/restUtils";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import SaksoversiktDineSaker from "./SaksoversiktDineSaker";
import {useBannerTittel} from "../redux/navigasjon/navigasjonUtils";
import SaksoversiktIngenSoknader from "./SaksoversiktIngenSoknader";
import {logAmplitudeEvent} from "../utils/amplitude";
import {ApplicationSpinner} from "../components/applicationSpinner/ApplicationSpinner";
import {setBreadcrumbs} from "../utils/breadcrumbs";

const Saksoversikt: React.FC = () => {
    document.title = "Dine søknader - Økonomisk sosialhjelp";
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    const dispatch = useDispatch();
    const innsynData: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);
    const restStatus = innsynData.restStatus.saker;
    const leserData: boolean = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;

    const mustLogin: boolean = restStatus === REST_STATUS.UNAUTHORIZED;

    let innsynApiKommunikasjonsProblemer = false;

    let alleSaker: Sakstype[] = [];
    if (!leserData) {
        if (restStatus === REST_STATUS.OK) {
            alleSaker = alleSaker.concat(innsynData.saker);
        }
        if (restStatus === REST_STATUS.SERVICE_UNAVAILABLE || restStatus === REST_STATUS.FEILET) {
            innsynApiKommunikasjonsProblemer = true;
        }
    }

    useEffect(() => {
        setBreadcrumbs();
    }, []);

    useEffect(() => {
        dispatch(hentSaksdata(InnsynsdataSti.SAKER, false));
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
        <>
            {(leserData || mustLogin) && <ApplicationSpinner />}
            {!leserData && !mustLogin && (
                <>
                    {innsynApiKommunikasjonsProblemer && (
                        <Alert variant="warning" className="luft_over_16px">
                            <BodyShort>Vi klarte ikke å hente inn all informasjonen på siden.</BodyShort>
                            <BodyShort>Du kan forsøke å oppdatere siden, eller prøve igjen senere.</BodyShort>
                        </Alert>
                    )}
                    {alleSaker.length > 0 ? <SaksoversiktDineSaker saker={alleSaker} /> : <SaksoversiktIngenSoknader />}
                </>
            )}
        </>
    );
};

export default Saksoversikt;
