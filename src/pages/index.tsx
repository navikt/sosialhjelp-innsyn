import React, {useState} from "react";
import {Alert, BodyShort} from "@navikt/ds-react";
import {useTranslation} from "next-i18next";
import {useHentAlleSaker} from "../../generated/saks-oversikt-controller/saks-oversikt-controller";
import {ApplicationSpinner} from "../components/applicationSpinner/ApplicationSpinner";
import SaksoversiktDineSaker from "../saksoversikt/SaksoversiktDineSaker";
import SaksoversiktIngenSoknader from "../saksoversikt/SaksoversiktIngenSoknader";
import {logAmplitudeEvent, logBrukerDefaultLanguage} from "../utils/amplitude";
import {GetServerSideProps, NextPage} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import MainLayout from "../components/MainLayout";
import useUpdateBreadcrumbs from "../hooks/useUpdateBreadcrumbs";
import Cookies from "js-cookie";

const Saksoversikt: NextPage = () => {
    const {t} = useTranslation();

    useUpdateBreadcrumbs(() => []);

    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    const {
        data: saker,
        isLoading,
        error,
    } = useHentAlleSaker({
        query: {
            onSuccess: (data) => {
                if (!pageLoadIsLogged) {
                    logBrukerDefaultLanguage(Cookies.get("decorator-language"));
                    logAmplitudeEvent("Hentet innsynsdata", {
                        antallSoknader: data?.length,
                    });
                    setPageLoadIsLogged(true);
                }
            },
        },
    });

    return (
        <MainLayout title={`${t("dineSoknader")} - ${t("app.tittel")}`} bannerTitle={t("app.tittel")}>
            {(isLoading || error?.status === 401) && <ApplicationSpinner />}
            {!isLoading && (
                <>
                    {error && (
                        <Alert variant="warning">
                            <BodyShort>{t("feilmelding.saksOversikt")}</BodyShort>
                            <BodyShort>{t("feilmelding.saksOversikt2")}</BodyShort>
                        </Alert>
                    )}
                    {saker?.length ? <SaksoversiktDineSaker saker={saker} /> : <SaksoversiktIngenSoknader />}
                </>
            )}
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({locale, req: {cookies}}) => {
    const translations = await serverSideTranslations(locale ?? "nb", ["common", "utbetalinger"]);
    return {props: {...translations}};
};

export default Saksoversikt;
