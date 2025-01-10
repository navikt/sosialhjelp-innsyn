import {useTranslation} from "next-i18next";
import React from "react";
import {Loader, Panel} from "@navikt/ds-react";
import {GetServerSideProps, NextPage} from "next";
import Head from "next/head";

import useIsMobile from "../utils/useIsMobile";
import {useHentAlleSaker} from "../generated/saks-oversikt-controller/saks-oversikt-controller";
import {useHarSoknaderMedInnsyn} from "../generated/soknad-med-innsyn-controller/soknad-med-innsyn-controller";
import UtbetalingsoversiktIngenSoknader from "../utbetalinger/UtbetalingsoversiktIngenSoknader";
import UtbetalingsoversiktIngenInnsyn from "../utbetalinger/UtbetalingsoversiktIngenInnsyn";
import {FilterProvider} from "../utbetalinger/beta/filter/FilterContext";
import UtbetalingerFilter from "../utbetalinger/beta/filter/UtbetalingerFilter";
import UtbetalingerPanelBeta from "../utbetalinger/beta/UtbetalingerPanelBeta";
import styles from "../utbetalinger/beta/utbetalinger.module.css";
import useUpdateBreadcrumbs from "../hooks/useUpdateBreadcrumbs";
import pageHandler from "../pagehandler/pageHandler";

import Error from "./_error";

const Utbetalinger: NextPage = () => {
    const {t} = useTranslation("utbetalinger");
    useUpdateBreadcrumbs(() => [{url: "/utbetaling", title: t("utbetaling")}]);
    const isMobile = useIsMobile();

    const {data: alleSaker, isLoading: isAlleSakerLoading, isError: harSakerError} = useHentAlleSaker();

    const {
        data: harSoknaderMedInnsyn,
        isLoading: isHarSoknaderMedInnsynLoading,
        isError: harSoknaderError,
    } = useHarSoknaderMedInnsyn();

    if (harSoknaderError || harSakerError) {
        return <Error statusCode={500} />;
    }

    if (isAlleSakerLoading || isHarSoknaderMedInnsynLoading) {
        return (
            <div className={styles.utbetalinger_side} data-theme="utbetalinger">
                <Loader className={styles.utbetalinger_loader} size="3xlarge" title="venter..." />
            </div>
        );
    }

    if (!alleSaker || alleSaker?.length === 0) {
        return (
            <div className={styles.utbetalinger_side} data-theme="utbetalinger">
                <UtbetalingsoversiktIngenSoknader />
            </div>
        );
    }

    if (!harSoknaderMedInnsyn) {
        return (
            <div className={styles.utbetalinger_side} data-theme="utbetalinger">
                <UtbetalingsoversiktIngenInnsyn />
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{t("documentTitle")}</title>
            </Head>
            <FilterProvider>
                <div className={styles.utbetalinger_side}>
                    <div className={styles.utbetalinger_side_innhold}>
                        {!isMobile && (
                            <Panel as="section" aria-label={t("filter.aria")} className={styles.filter_section}>
                                <UtbetalingerFilter />
                            </Panel>
                        )}
                        <UtbetalingerPanelBeta />
                    </div>
                </div>
            </FilterProvider>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = (context) => pageHandler(context, ["common", "utbetalinger"]);

export default Utbetalinger;
