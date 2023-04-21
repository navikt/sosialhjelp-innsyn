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
import useIsMobile from "../../utils/useIsMobile";
import {useTranslation} from "react-i18next";
import {Panel} from "@navikt/ds-react";

const UtbetalingerBeta = () => {
    const {t} = useTranslation("utbetalinger");

    document.title = t("documentTitle");
    const {pathname} = useLocation();
    const dispatch = useDispatch();
    const isMobile = useIsMobile();
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

    if (isAlleSakerLoading || isHarSoknaderMedInnsynLoading) {
        return <></>;
    }

    if (!alleSaker || alleSaker?.length === 0) {
        return (
            <div className={styles.utbetalinger_side} data-theme="utbetalinger-beta">
                <UtbetalingsoversiktIngenSoknader />
            </div>
        );
    }

    if (!harSoknaderMedInnsyn) {
        return (
            <div className={styles.utbetalinger_side} data-theme="utbetalinger-beta">
                <UtbetalingsoversiktIngenInnsyn />
            </div>
        );
    }

    return (
        <FilterProvider>
            <div className={styles.utbetalinger_side}>
                {!isMobile && (
                    <Panel as="section" aria-label={t("filter.aria")} className={styles.filter_section}>
                        <UtbetalingerFilter />
                    </Panel>
                )}

                <UtbetalingerPanelBeta />
            </div>
        </FilterProvider>
    );
};

export default UtbetalingerBeta;
