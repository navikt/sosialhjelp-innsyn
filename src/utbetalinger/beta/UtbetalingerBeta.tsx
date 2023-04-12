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

const UtbetalingerBeta = () => {
    document.title = "Utbetalinger - Økonomisk sosialhjelp";
    const {pathname} = useLocation();
    useEffect(() => {
        setBreadcrumbs({title: "Utbetalinger", url: `/sosialhjelp${pathname}`});
    }, [pathname]);

    const {data: alleSaker, isLoading: isAlleSakerLoading} = useHentAlleSaker();

    const {
        data: harSoknaderMedInnsyn,
        isLoading: isHarSoknaderMedInnsynLoading,
        error: soknaderError,
    } = useHarSoknaderMedInnsyn();

    /*
    useEffect(() => {
        if (errosoknaderErrorr?.message === HttpErrorType.UNAUTHORIZED) {
            console.log("reload");
            window.location.reload();
        } else if (soknaderError) {
            console.log("", soknaderError);
            dispatch(visFeilside(Feilside.TEKNISKE_PROBLEMER));
        }
    }, [soknaderError, dispatch]);


     */
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
