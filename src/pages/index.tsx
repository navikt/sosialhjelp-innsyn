import React from "react";
import { Alert, BodyShort } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";
import { GetServerSideProps, NextPage } from "next";
import styled from "styled-components";
import { useIsFetching } from "@tanstack/react-query";

import { useHentAlleSaker } from "../generated/saks-oversikt-controller/saks-oversikt-controller";
import { ApplicationSpinner } from "../components/applicationSpinner/ApplicationSpinner";
import SaksoversiktDineSaker from "../saksoversikt/SaksoversiktDineSaker";
import SaksoversiktIngenSoknader from "../saksoversikt/SaksoversiktIngenSoknader";
import MainLayout from "../components/MainLayout";
import useUpdateBreadcrumbs from "../hooks/useUpdateBreadcrumbs";
import pageHandler from "../pagehandler/pageHandler";
import UxSignalsWidget from "../components/widgets/UxSignalsWidget";
import { useSakslisteDebug } from "../hooks/useSakslisteDebug";

const Preamble = styled("div")`
    margin-bottom: 1.5rem;
`;

const Saksoversikt: NextPage = () => {
    const { t } = useTranslation();

    useUpdateBreadcrumbs(() => []);

    const isFetching = useIsFetching({ queryKey: ["dekorator-login"] });
    const {
        data: saker,
        isLoading,
        error,
        status,
        failureReason,
    } = useHentAlleSaker({ query: { enabled: isFetching === 0 } });
    useSakslisteDebug({ saker, isLoading, error, status, failureReason });

    return (
        <MainLayout title={t("app.tittel")} bannerTitle={t("app.tittel")}>
            {isLoading && <ApplicationSpinner />}
            {!isLoading && (
                <>
                    <Preamble>
                        {error && (
                            <Alert variant="warning">
                                <BodyShort>{t("feilmelding.saksOversikt")}</BodyShort>
                                <BodyShort>{t("feilmelding.saksOversikt2")}</BodyShort>
                            </Alert>
                        )}
                        {saker?.some((it) => it.isBrokenSoknad) && (
                            <Alert variant="warning">
                                <BodyShort>{t("soknaderUtenVedlegg.forside")}</BodyShort>
                            </Alert>
                        )}
                        <UxSignalsWidget embedCode="panel-1dxe3xqk8p" />
                    </Preamble>
                    {saker?.length ? <SaksoversiktDineSaker saker={saker} /> : <SaksoversiktIngenSoknader />}
                </>
            )}
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps = (context) => pageHandler(context, ["common", "utbetalinger"]);

export default Saksoversikt;
