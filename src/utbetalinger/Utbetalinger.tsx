import React, {useEffect, useState} from "react";
import Periodevelger from "./Periodevelger";
import UtbetalingerPanel from "./UtbetalingerPanel";
import useUtbetalingerService, {UtbetalingSakType} from "./service/useUtbetalingerService";
import {fetchToJson, REST_STATUS} from "../utils/restUtils";
import {useBannerTittel} from "../redux/navigasjon/navigasjonUtils";
import "./utbetalinger.css";
import {
    filtrerMaanederUtenUtbetalinger,
    filtrerUtbetalingerForTidsinterval,
    filtrerUtbetalingerPaaMottaker,
} from "./utbetalingerUtils";
import Brodsmulesti, {UrlType} from "../components/brodsmuleSti/BrodsmuleSti";
import {useDispatch, useSelector} from "react-redux";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import {
    Feilside,
    InnsynsdataSti,
    InnsynsdataType,
    Sakstype,
    visFeilside,
} from "../redux/innsynsdata/innsynsdataReducer";
import {logAmplitudeEvent} from "../utils/amplitude";
import {InnsynAppState} from "../redux/reduxTypes";
import useSoknadsSakerService from "../saksoversikt/sakerFraSoknad/useSoknadsSakerService";
import {IngenUtbetalingsoversikt} from "./IngenUtbetalingsoversikt";
import styled from "styled-components/macro";
let DEFAULT_ANTALL_MND_VIST: number = 3;

const StyledUtbetalinger = styled.div`
    margin-top: 4rem;
    display: flex;
    flex-direction: row;
    gap: 2rem;
    @media screen and (max-width: 900px) {
        margin-top: 0;

        flex-direction: column;
    }
`;

const StyledUtbetalingerFilter = styled.div`
    display: flex;
    flex-direction: column;
    flex: auto;

    width: 16rem;

    @media screen and (max-width: 900px) {
        width: 100%;

        .utbetalinger_periodevelger_panel {
            width: 100%;
            margin-bottom: 1rem;
        }
    }
`;

const Utbetalinger: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hentSaksdata(InnsynsdataSti.SAKER, true));
    }, [dispatch]);

    document.title = "Utbetalingsoversikt - Økonomisk sosialhjelp";
    const [visAntallMnd, setVisAntallMnd] = useState<number>(DEFAULT_ANTALL_MND_VIST);
    const [hentetAntallMnd, setHentetAntallMnd] = useState<number>(DEFAULT_ANTALL_MND_VIST);
    const [tilBrukersKonto, setTilBrukersKonto] = useState<boolean>(true);
    const [tilAnnenMottaker, setTilAnnenMottaker] = useState<boolean>(true);
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    const [harSoknaderMedInnsyn, setHarSoknaderMedInnsyn] = useState(false);
    const [lasterSoknaderMedInnsyn, setLasterSoknaderMedInnsyn] = useState(true);

    useBannerTittel("Utbetalingsoversikt");

    const utbetalingerService = useUtbetalingerService(hentetAntallMnd);

    const oppdaterPeriodeOgMottaker = (antMndTilbake: number, tilDinKnt: boolean, tilAnnenKonto: boolean): void => {
        if (antMndTilbake !== visAntallMnd) {
            setVisAntallMnd(antMndTilbake);
            if (antMndTilbake > hentetAntallMnd) {
                setHentetAntallMnd(antMndTilbake);
            }
        }
        if (tilBrukersKonto !== tilDinKnt) {
            setTilBrukersKonto(tilDinKnt);
        }
        if (tilAnnenMottaker !== tilAnnenKonto) {
            setTilAnnenMottaker(tilAnnenKonto);
        }
    };

    const utbetalinger: UtbetalingSakType[] =
        utbetalingerService.restStatus === REST_STATUS.OK ? utbetalingerService.payload : [];

    useEffect(() => {
        if (!pageLoadIsLogged && utbetalingerService.restStatus === REST_STATUS.OK) {
            logAmplitudeEvent("Lastet utbetalinger", {antall: utbetalinger.length});
            setPageLoadIsLogged(true);
        }
    }, [utbetalingerService.restStatus, pageLoadIsLogged, utbetalinger.length]);

    const now: Date = new Date();
    let filtrerteUtbetalinger = filtrerUtbetalingerForTidsinterval(utbetalinger, visAntallMnd, now);
    filtrerteUtbetalinger = filtrerUtbetalingerPaaMottaker(filtrerteUtbetalinger, tilBrukersKonto, tilAnnenMottaker);
    filtrerteUtbetalinger = filtrerMaanederUtenUtbetalinger(filtrerteUtbetalinger);

    const innsynData: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);
    const innsynRestStatus = innsynData.restStatus.saker;
    const leserInnsynData: boolean =
        innsynRestStatus === REST_STATUS.INITIALISERT || innsynRestStatus === REST_STATUS.PENDING;

    const soknadApiData = useSoknadsSakerService();
    const leserSoknadApiData: boolean =
        soknadApiData.restStatus === REST_STATUS.INITIALISERT || soknadApiData.restStatus === REST_STATUS.PENDING;

    const leserData: boolean = leserInnsynData || leserSoknadApiData;

    let alleSaker: Sakstype[] = [];
    if (!leserData) {
        if (innsynRestStatus === REST_STATUS.OK) {
            alleSaker = alleSaker.concat(innsynData.saker);
        }
        if (soknadApiData.restStatus === REST_STATUS.OK) {
            alleSaker = alleSaker.concat(soknadApiData.payload.results);
        }
    }
    const harSaker = alleSaker.length > 0;

    useEffect(() => {
        fetchToJson<boolean>("/innsyn/harSoknaderMedInnsyn")
            .then((response) => {
                setHarSoknaderMedInnsyn(response);
                setLasterSoknaderMedInnsyn(false);
            })
            .catch(() => {
                dispatch(visFeilside(Feilside.TEKNISKE_PROBLEMER));
            });
    }, [setHarSoknaderMedInnsyn, setLasterSoknaderMedInnsyn, dispatch]);

    return (
        <div>
            <Brodsmulesti
                tittel={"Utbetalingsoversikt for økonomisk sosialhjelp"}
                tilbakePilUrlType={UrlType.ABSOLUTE_PATH}
                foreldreside={{
                    tittel: "Økonomisk sosialhjelp",
                    path: "/sosialhjelp/innsyn/",
                    urlType: UrlType.ABSOLUTE_PATH,
                }}
                className="breadcrumbs__luft_rundt"
            />

            {harSoknaderMedInnsyn && harSaker && !lasterSoknaderMedInnsyn && (
                <StyledUtbetalinger>
                    <StyledUtbetalingerFilter>
                        <Periodevelger
                            className="utbetalinger_periodevelger_panel"
                            antMndTilbake={visAntallMnd}
                            onChange={(antMndTilbake: number, tilDinKnt: boolean, tilAnnenMottaker: boolean) =>
                                oppdaterPeriodeOgMottaker(antMndTilbake, tilDinKnt, tilAnnenMottaker)
                            }
                        />
                    </StyledUtbetalingerFilter>
                    <UtbetalingerPanel
                        utbetalinger={filtrerteUtbetalinger}
                        lasterData={utbetalingerService.restStatus === REST_STATUS.PENDING}
                    />
                </StyledUtbetalinger>
            )}
            <IngenUtbetalingsoversikt
                harSoknaderMedInnsyn={harSoknaderMedInnsyn}
                lasterSoknaderMedInnsyn={lasterSoknaderMedInnsyn}
                harSaker={harSaker}
                leserData={leserData}
            />
        </div>
    );
};

export default Utbetalinger;
