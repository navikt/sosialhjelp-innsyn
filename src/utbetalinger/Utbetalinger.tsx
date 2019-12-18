import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../redux/reduxTypes";
import Periodevelger from "./Periodevelger";
import UtbetalingerPanel from "./UtbetalingerPanel";
import useUtbetalingerService, {UtbetalingMaaned, UtbetalingSakType} from "./service/useUtbetalingerService";
import {REST_STATUS} from "../utils/restUtils";
import {useBannerTittel, useBrodsmuleSti} from "../redux/navigasjon/navigasjonUtils";
import {InnsynsdataSti} from "../redux/innsynsdata/innsynsdataReducer";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import "./utbetalinger.less";

const diffInMonths =(d1: Date, d2: Date) => {
    var d1Y = d1.getFullYear();
    var d2Y = d2.getFullYear();
    var d1M = d1.getMonth();
    var d2M = d2.getMonth();
    return (d2M+12*d2Y)-(d1M+12*d1Y);
};

const filtrerUtbetalingerForTidsinterval = (utbetalinger: UtbetalingSakType[], visAntallMnd: number, now: Date): UtbetalingSakType[] => {
    return utbetalinger.filter((utbetalingSak: UtbetalingSakType) => {
        const foersteIManeden: Date = new Date(utbetalingSak.foersteIManeden);
        const innenforTidsintervall: boolean = diffInMonths(foersteIManeden, now) < visAntallMnd;
        return innenforTidsintervall;
    });
};


const filtrerUtbetalingerPaaMottaker = (utbetalinger: UtbetalingSakType[], visTilBrukersKonto: boolean, visTilAnnenMottaker: boolean): UtbetalingSakType[] => {
    return utbetalinger.map((utbetalingSak: UtbetalingSakType) => {
        return {
            ...utbetalingSak,
            utbetalinger: utbetalingSak.utbetalinger.filter((utbetalingMaaned: UtbetalingMaaned, index: number) => {
                const blirBetaltTilBruker: boolean = utbetalingMaaned.mottaker === "søkers fnr";
                if (blirBetaltTilBruker) {
                    return visTilBrukersKonto;
                } else {
                    return visTilAnnenMottaker;
                }
            })
        };
    });
};

const Utbetalinger: React.FC = () => {
    const [visAntallMnd, setVisAntallMnd] = useState<number>(3);
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

    // utbetalinger = mockUtbetalinger;

    const now: Date = new Date();
    utbetalinger = filtrerUtbetalingerForTidsinterval(utbetalinger, visAntallMnd, now);
    utbetalinger = filtrerUtbetalingerPaaMottaker(utbetalinger, tilBrukersKonto, tilAnnenMottaker);

    console.log(utbetalingerService.restStatus);

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
                <UtbetalingerPanel utbetalinger={utbetalinger} lasterData={utbetalingerService.restStatus === REST_STATUS.PENDING}/>
            </div>
        </div>
    );

};

export {filtrerUtbetalingerForTidsinterval, filtrerUtbetalingerPaaMottaker};
export default Utbetalinger;
