import { useTranslation } from "next-i18next";
import React from "react";
import { Loader, Panel } from "@navikt/ds-react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import useIsMobile from "../utils/useIsMobile";
import { useHentAlleSaker } from "../generated/saks-oversikt-controller/saks-oversikt-controller";
import { useHarSoknaderMedInnsyn } from "../generated/soknad-med-innsyn-controller/soknad-med-innsyn-controller";
import UtbetalingsoversiktIngenSoknader from "../utbetalinger/UtbetalingsoversiktIngenSoknader";
import UtbetalingsoversiktIngenInnsyn from "../utbetalinger/UtbetalingsoversiktIngenInnsyn";
import UtbetalingerFilter from "../utbetalinger/filter/UtbetalingerFilter";
import UtbetalingerPanel from "../utbetalinger/UtbetalingerPanel";
import styles from "../utbetalinger/utbetalinger.module.css";
import useUpdateBreadcrumbs from "../hooks/useUpdateBreadcrumbs";
import pageHandler from "../pagehandler/pageHandler";
import { FilterProvider } from "../utbetalinger/filter/FilterProvider";

import Error from "./_error";

const Utbetalinger: NextPage = () => {
    const { t } = useTranslation("utbetalinger");
    useUpdateBreadcrumbs(() => [{ url: "/utbetaling", title: t("utbetaling") }]);
    const isMobile = useIsMobile();

    const { data: alleSaker, isLoading: isAlleSakerLoading, isError: harSakerError } = useHentAlleSaker();

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
                <Loader className="m-[100px]" size="3xlarge" title="venter..." />
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
                    <div className="flex flex-row justify-center gap-8 min-h-[40vh]">
                        {!isMobile && (
                            <Panel as="section" aria-label={t("filter.aria")} className="h-fit p-[1.5rem] pt-[1.5rem]">
                                <UtbetalingerFilter />
                            </Panel>
                        )}
                        <UtbetalingerPanel />
                    </div>
                </div>
            </FilterProvider>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = (context) => pageHandler(context, ["common", "utbetalinger"]);

export default Utbetalinger;
