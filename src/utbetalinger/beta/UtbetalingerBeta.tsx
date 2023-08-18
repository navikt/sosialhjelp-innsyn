import React, {useEffect, useState} from "react";
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
import {Loader, Panel} from "@navikt/ds-react";
import {IngenUtbetalinger} from "../IngenUtbetalinger";
import {useHentUtbetalinger} from "../../generated/utbetalinger-controller/utbetalinger-controller";
import {logAmplitudeEvent} from "../../utils/amplitude";

const UtbetalingerBeta = () => {
    const {t} = useTranslation("utbetalinger");
    document.title = t("documentTitle");
    const {pathname} = useLocation();
    const dispatch = useDispatch();
    const isMobile = useIsMobile();
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    useEffect(() => {
        setBreadcrumbs({title: "Utbetalinger", url: `/sosialhjelp${pathname}`});
    }, [pathname]);

    const {data: alleSaker, isLoading: isAlleSakerLoading, isError: harSakerError} = useHentAlleSaker();
    const {data: utbetalingerData} = useHentUtbetalinger(
        {},
        {
            query: {
                onSuccess: (data) => {
                    const antall = data.reduce((acc, curr) => acc + curr.utbetalinger.length, 0);
                    if (!pageLoadIsLogged) {
                        logAmplitudeEvent("Lastet utbetalinger", {antall: antall});
                        setPageLoadIsLogged(true);
                    }
                },
            },
        }
    );

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
        return (
            <div className={styles.utbetalinger_side} data-theme="utbetalinger-beta">
                <Loader className={styles.utbetalinger_loader} size="3xlarge" title="venter..." />
            </div>
        );
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

    if (!utbetalingerData || utbetalingerData?.length === 0) {
        return (
            <div className={styles.utbetalinger_side} data-theme="utbetalinger-beta">
                <IngenUtbetalinger />
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
