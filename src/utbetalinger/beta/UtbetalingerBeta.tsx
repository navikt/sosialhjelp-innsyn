import React, {useEffect} from "react";
import UtbetalingsoversiktIngenInnsyn from "../UtbetalingsoversiktIngenInnsyn";
import {useHentAlleSaker} from "../../generated/saks-oversikt-controller/saks-oversikt-controller";
import {useLocation} from "react-router-dom";
import {useHarSoknaderMedInnsyn} from "../../generated/soknad-med-innsyn-controller/soknad-med-innsyn-controller";
import UtbetalingsoversiktIngenSoknader from "../UtbetalingsoversiktIngenSoknader";
import {setBreadcrumbs} from "../../utils/breadcrumbs";
import UtbetalingerPanelBeta from "./UtbetalingerPanelBeta";
import styles from "./utbetalinger.module.css";
import {FilterProvider} from "./filter/FilterContext";
import UtbetalingerFilter from "./filter/UtbetalingerFilter";
import {Feilside, visFeilside} from "../../redux/innsynsdata/innsynsdataReducer";
import {useDispatch} from "react-redux";

const UtbetalingerBeta = () => {
    document.title = "Utbetalinger - Økonomisk sosialhjelp";
    const {pathname} = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        setBreadcrumbs({title: "Utbetalinger", url: `/sosialhjelp${pathname}`});
    }, [pathname]);

    const {data: alleSaker, isLoading: isAlleSakerLoading, isError: harSakerError} = useHentAlleSaker();

    const {
        data: harSoknaderMedInnsyn,
        isLoading: isHarSoknaderMedInnsynLoading,
        isError: harSoknaderError,
    } = useHarSoknaderMedInnsyn();

    useEffect(() => {
        if (harSoknaderError || harSakerError) {
            dispatch(visFeilside(Feilside.TEKNISKE_PROBLEMER));
        }
    }, [harSoknaderError, harSakerError, dispatch]);

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
                <UtbetalingerPanelBeta />
            </div>
        </FilterProvider>
    );
};

export default UtbetalingerBeta;
