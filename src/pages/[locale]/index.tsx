import React from "react";
import { Alert, BodyShort } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { NextPage } from "next";
import styled from "styled-components";
import { logger } from "@navikt/next-logger";
import { GetServerSidePropsContext } from "next/dist/types";

import {
    getHentAlleSakerQueryKey,
    useHentAlleSaker,
} from "../../generated/saks-oversikt-controller/saks-oversikt-controller";
import { ApplicationSpinner } from "../../components/applicationSpinner/ApplicationSpinner";
import SaksoversiktDineSaker from "../../saksoversikt/SaksoversiktDineSaker";
import SaksoversiktIngenSoknader from "../../saksoversikt/SaksoversiktIngenSoknader";
import MainLayout from "../../components/MainLayout";
import useUpdateBreadcrumbs from "../../hooks/useUpdateBreadcrumbs";
import pageHandler from "../../pagehandler/pageHandler";
import { extractAuthHeader } from "../../utils/authUtils";
import { browserEnv } from "../../config/env";

const Preamble = styled("div")`
    margin-bottom: 1.5rem;
`;

const Saksoversikt: NextPage = () => {
    const t = useTranslations("common");
    useUpdateBreadcrumbs(() => []);

    const { data: saker, isLoading, error } = useHentAlleSaker();

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
                    </Preamble>
                    {saker?.length ? <SaksoversiktDineSaker saker={saker} /> : <SaksoversiktIngenSoknader />}
                </>
            )}
        </MainLayout>
    );
};

export const getServerSideProps = async (context: GetServerSidePropsContext<{ locale: "nb" | "nn" | "en" }>) => {
    const { req } = context;
    const token = extractAuthHeader(req);
    if (!token) {
        return {
            redirect: {
                destination: process.env.NEXT_INNSYN_MOCK_LOGIN_URL!,
                permanent: false,
            },
        };
    }
    const headers: HeadersInit = new Headers();
    headers.append("Authorization", token);
    return pageHandler(context, (queryClient) => [
        queryClient.prefetchQuery({
            queryKey: getHentAlleSakerQueryKey(),
            retry: false,
            queryFn: async () => {
                try {
                    const response = await fetch(buildUrl(), { method: "GET", headers });
                    if (response.ok) {
                        return response.json();
                    } else {
                        logger.warn(
                            `Fikk feil i prefetch på /saker. status: ${response.status}. message: ${await response.text()}`
                        );
                    }
                } catch (e: unknown) {
                    logger.warn(`Fikk feil i prefetch på /saker. error: ${e}`);
                    throw e;
                }
            },
        }),
    ]);
};

function buildUrl() {
    const isLocal = ["local", "e2e"].includes(browserEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT);
    const portPart = isLocal ? ":8080" : "";
    return `http://${process.env.NEXT_INNSYN_API_HOSTNAME}${portPart}/sosialhjelp/innsyn-api/api/v1/innsyn/saker`;
}

export default Saksoversikt;
