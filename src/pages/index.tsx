import React from "react";
import { Alert, BodyShort } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";
import { GetServerSideProps, NextPage } from "next";
import styled from "styled-components";
import { QueryClient, useIsFetching } from "@tanstack/react-query";

import {
    getHentAlleSakerQueryKey,
    getHentAlleSakerUrl,
    useHentAlleSaker,
} from "../generated/saks-oversikt-controller/saks-oversikt-controller";
import { ApplicationSpinner } from "../components/applicationSpinner/ApplicationSpinner";
import SaksoversiktDineSaker from "../saksoversikt/SaksoversiktDineSaker";
import SaksoversiktIngenSoknader from "../saksoversikt/SaksoversiktIngenSoknader";
import MainLayout from "../components/MainLayout";
import useUpdateBreadcrumbs from "../hooks/useUpdateBreadcrumbs";
import pageHandler from "../pagehandler/pageHandler";
import { useSakslisteDebug } from "../hooks/useSakslisteDebug";
import { extractAuthHeader } from "../utils/authUtils";
import { harTilgangResponse } from "../generated/tilgang-controller/tilgang-controller";

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
                    </Preamble>
                    {saker?.length ? <SaksoversiktDineSaker saker={saker} /> : <SaksoversiktIngenSoknader />}
                </>
            )}
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const queryClient = new QueryClient();
    const token = extractAuthHeader(req);
    const headers: HeadersInit = new Headers();
    headers.append("Authorization", token);

    await queryClient.prefetchQuery({
        queryKey: getHentAlleSakerQueryKey(),
        queryFn: async () => {
            const response = await fetch(buildUrl(), { method: "GET", headers });
            const data: harTilgangResponse = await response.json();
            return data;
        },
    });
    return pageHandler(context, ["common", "utbetalinger"], queryClient);
};

function buildUrl() {
    const isLocal = "local" === process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT;
    const portPart = isLocal ? ":8080" : "";
    return `http://${process.env.NEXT_INNSYN_API_HOSTNAME}${portPart}${getHentAlleSakerUrl()}`;
}

export default Saksoversikt;
