import React, {useEffect, useState} from "react";
import UtbetalingsoversiktIngenInnsyn from "../UtbetalingsoversiktIngenInnsyn";
import {useHentUtbetalteUtbetalinger} from "../../generated/utbetalinger-controller/utbetalinger-controller";
import {useHentAlleSaker} from "../../generated/saks-oversikt-controller/saks-oversikt-controller";
import {useLocation} from "react-router-dom";
import {useHarSoknaderMedInnsyn} from "../../generated/soknad-med-innsyn-controller/soknad-med-innsyn-controller";
import UtbetalingsoversiktIngenSoknader from "../UtbetalingsoversiktIngenSoknader";
import {useDispatch} from "react-redux";
import {Feilside, visFeilside} from "../../redux/innsynsdata/innsynsdataReducer";
import {logAmplitudeEvent} from "../../utils/amplitude";
import {setBreadcrumbs} from "../../utils/breadcrumbs";
import UtbetalingerPanelBeta from "./UtbetalingerPanelBeta";
import styles from "./utbetalinger.module.css";
import {FilterProvider} from "./filter/FilterContext";
import UtbetalingerFilter from "./filter/UtbetalingerFilter";
import {HttpErrorType} from "../../utils/restUtils";

const UtbetalingerBeta = () => {
    const dispatch = useDispatch();

    document.title = "Utbetalinger - Økonomisk sosialhjelp";

    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);

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

    const {pathname} = useLocation();
    useEffect(() => {
        setBreadcrumbs({title: "Utbetalingsoversikt", url: `/sosialhjelp${pathname}`});
    }, [pathname]);

    const {data: alleSaker, isLoading: isAlleSakerLoading} = useHentAlleSaker();

    const {data: harSoknaderMedInnsyn, isLoading: isHarSoknaderMedInnsynLoading, error} = useHarSoknaderMedInnsyn();

    useEffect(() => {
        if (error?.message === HttpErrorType.UNAUTHORIZED) {
            console.log("reload");
            window.location.reload();
        } else if (error) {
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
                <UtbetalingerPanelBeta utbetalinger={data ?? []} lasterData={isLoading} />
            </div>
        </FilterProvider>
    );
};

export default UtbetalingerBeta;
