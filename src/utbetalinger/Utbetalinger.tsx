import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../redux/reduxTypes";
import Periodevelger from "./Periodevelger";
import UtbetalingerPanel from "./UtbetalingerPanel";
import useUtbetalingerService, {UtbetalingSakType} from "./service/useUtbetalingerService";
import {REST_STATUS} from "../utils/restUtils";
import {useBannerTittel, useBrodsmuleSti} from "../redux/navigasjon/navigasjonUtils";
import {InnsynsdataSti} from "../redux/innsynsdata/innsynsdataReducer";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import "./utbetalinger.less";
import {filtrerUtbetalingerPaaMottaker, filtrerUtbetalingerForTidsinterval} from "./utbetalingerUtils";
import {mockUtbetalinger} from "./Utbetalinger.testdata";
import {erDevMiljo} from "../utils/ServiceHookTypes";

let DEFAULT_ANTALL_MND_VIST: number = 3;
if (erDevMiljo()) {
    DEFAULT_ANTALL_MND_VIST = 12;
}

const Utbetalinger: React.FC = () => {
    const [visAntallMnd, setVisAntallMnd] = useState<number>(DEFAULT_ANTALL_MND_VIST);
    const [tilBrukersKonto, setTilBrukersKonto] = useState<boolean>(true);
    const [tilAnnenMottaker, setTilAnnenMottaker] = useState<boolean>(true);

    useBrodsmuleSti([
        {sti: "/sosialhjelp/innsyn", tittel: "Økonomisk sosialhjelp"},
        {sti: "/sosialhjelp/innsyn/utbetaling", tittel: "Utbetalingsoversikt"}
    ]);

    useBannerTittel("Utbetalingsoversikt for økonomisk sosialhjelp");

    const utbetalingerService = useUtbetalingerService();

    const oppdaterPeriodeOgMottaker = (antMndTilbake: number, tilDinKnt: boolean, tilAnnenKonto: boolean): void => {
        if (antMndTilbake !== visAntallMnd) {
            setVisAntallMnd(antMndTilbake);
        }
        if (tilBrukersKonto !== tilDinKnt) {
            setTilBrukersKonto(tilDinKnt);
        }
        if (tilAnnenMottaker !== tilAnnenKonto) {
            setTilAnnenMottaker(tilAnnenKonto);
        }
    };

    const dispatch = useDispatch();
    const restStatus: any = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus);
    useEffect(() => {
        if (restStatus.saker !== REST_STATUS.OK) {
            dispatch(hentSaksdata(InnsynsdataSti.SAKER))
        }
    }, [dispatch, restStatus.saker]);

    let utbetalinger: UtbetalingSakType[] = utbetalingerService.restStatus === REST_STATUS.OK ?
        utbetalingerService.payload : [];

    utbetalinger = mockUtbetalinger;

    const now: Date = new Date();
    utbetalinger = filtrerUtbetalingerForTidsinterval(utbetalinger, visAntallMnd, now);
    utbetalinger = filtrerUtbetalingerPaaMottaker(utbetalinger, tilBrukersKonto, tilAnnenMottaker);

    return (
        <div className="utbetalinger">
            <div className="utbetalinger_row">
                <div className="utbetalinger_column">
                    <div className="utbetalinger_column_1">
                        <Periodevelger
                            className="utbetalinger_periodevelger_panel"
                            antMndTilbake={visAntallMnd}
                            onChange={
                                (antMndTilbake: number, tilDinKnt: boolean, tilAnnenMottaker: boolean) =>
                                    oppdaterPeriodeOgMottaker(antMndTilbake, tilDinKnt, tilAnnenMottaker)}
                        />
                    </div>
                </div>
                <UtbetalingerPanel
                    utbetalinger={utbetalinger}
                    lasterData={utbetalingerService.restStatus === REST_STATUS.PENDING}
                />
            </div>
        </div>
    );

};

export default Utbetalinger;
