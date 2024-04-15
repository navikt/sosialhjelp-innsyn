import React, {useEffect, useState} from "react";
import {Alert, BodyShort, Box} from "@navikt/ds-react";
import {useTranslation} from "next-i18next";
import {useHentAlleSaker} from "../generated/saks-oversikt-controller/saks-oversikt-controller";
import {ApplicationSpinner} from "../components/applicationSpinner/ApplicationSpinner";
import SaksoversiktDineSaker from "../saksoversikt/SaksoversiktDineSaker";
import SaksoversiktIngenSoknader from "../saksoversikt/SaksoversiktIngenSoknader";
import {logAmplitudeEvent} from "../utils/amplitude";
import {GetServerSideProps, NextPage} from "next";
import MainLayout from "../components/MainLayout";
import useUpdateBreadcrumbs from "../hooks/useUpdateBreadcrumbs";
import pageHandler from "../pagehandler/pageHandler";
import styled from "styled-components";

const StyledAlert = styled(Alert)`
    margin-bottom: 1.5rem;
`;

const Saksoversikt: NextPage = () => {
    const {t} = useTranslation();

    useUpdateBreadcrumbs(() => []);

    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    const {data: saker, isLoading, error} = useHentAlleSaker();

    useEffect(() => {
        if (!pageLoadIsLogged) {
            logAmplitudeEvent("Hentet innsynsdata", {
                antallSoknader: saker?.length,
            });
            setPageLoadIsLogged(true);
        }
    }, [saker, pageLoadIsLogged]);

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
                    {saker?.some((it) => it.isBrokenSoknad) && (
                        <StyledAlert variant="warning">
                            <BodyShort>{t("soknaderUtenVedlegg.forside")}</BodyShort>
                        </StyledAlert>
                    )}
                    {saker?.length ? <SaksoversiktDineSaker saker={saker} /> : <SaksoversiktIngenSoknader />}
                </>
            )}
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps = (context) => pageHandler(context, ["common", "utbetalinger"]);

export default Saksoversikt;
