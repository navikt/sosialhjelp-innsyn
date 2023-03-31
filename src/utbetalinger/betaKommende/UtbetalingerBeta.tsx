import React, {useEffect, useState} from "react";
import UtbetalingsoversiktIngenInnsyn from "../UtbetalingsoversiktIngenInnsyn";
import {
    useHentKommendeUtbetalinger,
    useHentUtbetalinger,
    useHentUtbetalteUtbetalinger,
} from "../../generated/utbetalinger-controller/utbetalinger-controller";
import {useHentAlleSaker} from "../../generated/saks-oversikt-controller/saks-oversikt-controller";
import {useLocation} from "react-router-dom";
import {useHarSoknaderMedInnsyn} from "../../generated/soknad-med-innsyn-controller/soknad-med-innsyn-controller";
import UtbetalingsoversiktIngenSoknader from "../UtbetalingsoversiktIngenSoknader";
import {useDispatch} from "react-redux";
import {useBannerTittel} from "../../redux/navigasjon/navigasjonUtils";
import {Feilside, visFeilside} from "../../redux/innsynsdata/innsynsdataReducer";
import {logAmplitudeEvent} from "../../utils/amplitude";
import {setBreadcrumbs} from "../../utils/breadcrumbs";
import UtbetalingerPanelBeta from "./UtbetalingerPanelBeta";
import styles from "./utbetalinger.module.css";
import {FilterProvider} from "./filter/FilterContext";
import UtbetalingerFilter from "./filter/UtbetalingerFilter";

let DEFAULT_ANTALL_MND_VIST: number = 3;

const UtbetalingerBeta = () => {
    const dispatch = useDispatch();

    document.title = "Utbetalinger - Økonomisk sosialhjelp";
    const [visAntallMnd, setVisAntallMnd] = useState<number>(DEFAULT_ANTALL_MND_VIST);
    const [hentetAntallMnd, setHentetAntallMnd] = useState<number>(DEFAULT_ANTALL_MND_VIST);
    const [tilBrukersKonto, setTilBrukersKonto] = useState<boolean>(true);
    const [tilAnnenMottaker, setTilAnnenMottaker] = useState<boolean>(true);
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);

    useBannerTittel("Utbetalinger");

    const {data, isLoading} = useHentUtbetalteUtbetalinger({
        query: {
            onSuccess: (data) => {
                if (!pageLoadIsLogged) {
                    logAmplitudeEvent("Lastet utbetalinger", {antall: data.length});
                    setPageLoadIsLogged(true);
                }
            },
        },
    });

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

    const {pathname} = useLocation();
    useEffect(() => {
        setBreadcrumbs({title: "Utbetalingsoversikt", url: `/sosialhjelp${pathname}`});
    }, [pathname]);

    const now: Date = new Date();
    let filtrerteUtbetalinger = data ?? [];
    //filtrerUtbetalingerForTidsinterval(data ?? [], visAntallMnd, now);
    //filtrerteUtbetalinger = filtrerUtbetalingerPaaMottaker(filtrerteUtbetalinger, tilBrukersKonto, tilAnnenMottaker);
    //filtrerteUtbetalinger = filtrerMaanederUtenUtbetalinger(filtrerteUtbetalinger);

    const {data: alleSaker, isLoading: isAlleSakerLoading} = useHentAlleSaker();

    const {data: harSoknaderMedInnsyn, isLoading: isHarSoknaderMedInnsynLoading, error} = useHarSoknaderMedInnsyn();

    useEffect(() => {
        if (error) {
            dispatch(visFeilside(Feilside.TEKNISKE_PROBLEMER));
        }
    }, [error, dispatch]);

    if (!isAlleSakerLoading && !alleSaker?.length) {
        return (
            <div className="blokk-center--wide">
                <UtbetalingsoversiktIngenSoknader />
            </div>
        );
    }

    if (!isHarSoknaderMedInnsynLoading && !harSoknaderMedInnsyn) {
        return (
            <div className="blokk-center--wide">
                <UtbetalingsoversiktIngenInnsyn />
            </div>
        );
    }

    return (
        <FilterProvider>
            <div className={styles.utbetalinger_side}>
                <UtbetalingerFilter />
                <UtbetalingerPanelBeta utbetalinger={filtrerteUtbetalinger} lasterData={isLoading} />
            </div>
        </FilterProvider>
    );
};

export default UtbetalingerBeta;
