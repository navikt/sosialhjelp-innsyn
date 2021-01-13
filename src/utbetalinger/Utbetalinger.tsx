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
import Brodsmulesti, {UrlType} from "../components/brodsmuleSti/BrodsmuleSti";
import {Sidetittel} from "nav-frontend-typografi";
import {useDispatch} from "react-redux";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import {InnsynsdataSti} from "../redux/innsynsdata/innsynsdataReducer";

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

    let utbetalinger: UtbetalingSakType[] =
        utbetalingerService.restStatus === REST_STATUS.OK ? utbetalingerService.payload : [];

    const now: Date = new Date();
    utbetalinger = filtrerUtbetalingerForTidsinterval(utbetalinger, visAntallMnd, now);
    utbetalinger = filtrerUtbetalingerPaaMottaker(utbetalinger, tilBrukersKonto, tilAnnenMottaker);
    utbetalinger = filtrerMaanederUtenUtbetalinger(utbetalinger);

    return (
        <div>
            <Brodsmulesti
                tittel={"Utbetalingsoversikt"}
                tilbakePilUrlType={UrlType.ABSOLUTE_PATH}
                foreldreside={{
                    tittel: "Økonomisk sosialhjelp",
                    path: "/sosialhjelp/innsyn/",
                    urlType: UrlType.ABSOLUTE_PATH,
                }}
                className="breadcrumbs__luft_rundt"
            />

            <div className="utbetalinger">
                <Sidetittel className="utbetalinger__overskrift">Utbetalingsoversikt</Sidetittel>
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
                        utbetalinger={utbetalinger}
                        lasterData={utbetalingerService.restStatus === REST_STATUS.PENDING}
                    />
                </div>
            </div>
        </div>
    );
};

export default Utbetalinger;
