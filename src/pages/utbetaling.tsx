import {useTranslation} from "next-i18next";
import useIsMobile from "../utils/useIsMobile";
import React, {useEffect} from "react";
import {useHentAlleSaker} from "../../generated/saks-oversikt-controller/saks-oversikt-controller";
import {useHentUtbetalinger} from "../../generated/utbetalinger-controller/utbetalinger-controller";
import {useHarSoknaderMedInnsyn} from "../../generated/soknad-med-innsyn-controller/soknad-med-innsyn-controller";
import UtbetalingsoversiktIngenSoknader from "../utbetalinger/UtbetalingsoversiktIngenSoknader";
import UtbetalingsoversiktIngenInnsyn from "../utbetalinger/UtbetalingsoversiktIngenInnsyn";
import {IngenUtbetalinger} from "../utbetalinger/IngenUtbetalinger";
import {FilterProvider} from "../utbetalinger/beta/filter/FilterContext";
import {Loader, Panel} from "@navikt/ds-react";
import UtbetalingerFilter from "../utbetalinger/beta/filter/UtbetalingerFilter";
import UtbetalingerPanelBeta from "../utbetalinger/beta/UtbetalingerPanelBeta";
import styles from "../utbetalinger/beta/utbetalinger.module.css";
import {GetServerSideProps, NextPage} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Head from "next/head";
import useUpdateBreadcrumbs from "../hooks/useUpdateBreadcrumbs";
import {useRouter} from "next/router";

const UtbetalingerBeta: NextPage = () => {
    const {t} = useTranslation("utbetalinger");
    useUpdateBreadcrumbs(() => [{url: "/utbetaling", title: t("utbetaling")}]);
    const isMobile = useIsMobile();
    const router = useRouter();

    const {data: alleSaker, isLoading: isAlleSakerLoading, error: harSakerError} = useHentAlleSaker();
    const {data: utbetalingerData} = useHentUtbetalinger();

    const {
        data: harSoknaderMedInnsyn,
        isLoading: isHarSoknaderMedInnsynLoading,
        isError: harSoknaderError,
    } = useHarSoknaderMedInnsyn();

    useEffect(() => {
        if (harSoknaderError || harSakerError) {
            console.log(harSoknaderError, harSakerError);
            throw new Error("Kunne ikke laste inn søknader eller saker");
        }
    }, [harSoknaderError, harSakerError, router]);

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
        <>
            <Head>
                <title>{t("documentTitle")}</title>
            </Head>
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
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
    const translations = await serverSideTranslations(locale ?? "nb", ["utbetalinger", "common"]);
    return {props: {...translations}};
};

export default UtbetalingerBeta;