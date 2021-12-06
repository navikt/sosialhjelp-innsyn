import React, {useEffect, useState} from "react";
import Periodevelger from "./Periodevelger";
import UtbetalingerPanel from "./UtbetalingerPanel";
import useUtbetalingerService, {UtbetalingSakType} from "./service/useUtbetalingerService";
import {REST_STATUS} from "../utils/restUtils";
import {useBannerTittel} from "../redux/navigasjon/navigasjonUtils";
import "./utbetalinger.less";
import {
    filtrerMaanederUtenUtbetalinger,
    filtrerUtbetalingerForTidsinterval,
    filtrerUtbetalingerPaaMottaker,
} from "./utbetalingerUtils";
import {useDispatch} from "react-redux";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import {InnsynsdataSti} from "../redux/innsynsdata/innsynsdataReducer";
import {logAmplitudeEvent} from "../utils/amplitude";
import {Heading} from "@navikt/ds-react";
import {useLocation} from "react-router";
import {setBreadcrumbs} from "../utils/breadcrumbs";

let DEFAULT_ANTALL_MND_VIST: number = 3;

const Utbetalinger: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hentSaksdata(InnsynsdataSti.SAKER));
    }, [dispatch]);

    document.title = "Utbetalingsoversikt - Økonomisk sosialhjelp";
    const [visAntallMnd, setVisAntallMnd] = useState<number>(DEFAULT_ANTALL_MND_VIST);
    const [hentetAntallMnd, setHentetAntallMnd] = useState<number>(DEFAULT_ANTALL_MND_VIST);
    const [tilBrukersKonto, setTilBrukersKonto] = useState<boolean>(true);
    const [tilAnnenMottaker, setTilAnnenMottaker] = useState<boolean>(true);
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);

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

    const {pathname} = useLocation();
    useEffect(() => {
        setBreadcrumbs({title: "Utbetalingsoversikt", url: `/sosialhjelp${pathname}`});
    }, [pathname]);

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

    return (
        <div>
            <div className="utbetalinger">
                <Heading level="1" size="2xlarge" spacing className="utbetalinger__overskrift">
                    Utbetalingsoversikt
                </Heading>
                <div className="utbetalinger_row">
                    <div className="utbetalinger_column">
                        <div className="utbetalinger_column_1">
                            <Periodevelger
                                className="utbetalinger_periodevelger_panel"
                                antMndTilbake={visAntallMnd}
                                onChange={(antMndTilbake: number, tilDinKnt: boolean, tilAnnenMottaker: boolean) =>
                                    oppdaterPeriodeOgMottaker(antMndTilbake, tilDinKnt, tilAnnenMottaker)
                                }
                            />
                        </div>
                    </div>
                    <UtbetalingerPanel
                        utbetalinger={filtrerteUtbetalinger}
                        lasterData={utbetalingerService.restStatus === REST_STATUS.PENDING}
                    />
                </div>
            </div>
        </div>
    );
};

export default Utbetalinger;
