import React from "react";
import { BodyLong, Heading } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { logger } from "@navikt/next-logger";
import { useRouter } from "next/router";

import { useHarTilgang } from "../generated/tilgang-controller/tilgang-controller";
import EllaBlunk from "../components/ellaBlunk";
import { UthevetPanel } from "../components/paneler/UthevetPanel";
import Banner from "../components/banner/Banner";
import { ApplicationSpinner } from "../components/applicationSpinner/ApplicationSpinner";

const StyledElla = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    margin-top: 2rem;
`;

const Forbidden = (): React.JSX.Element => {
    const { t } = useTranslation();
    const router = useRouter();
    const { data, isLoading } = useHarTilgang();
    if (isLoading) {
        return (
            <div className="informasjon-side">
                {!router.pathname.includes("/utbetaling") && <Banner>{t("app.tittel")}</Banner>}
                <ApplicationSpinner />
            </div>
        );
    }

    if (!data?.data.harTilgang) {
        logger.info(
            data?.data.fornavn ? "Viser tilgangskontrollside med fornavn" : "Viser tilgangskontrollside uten fornavn"
        );
    }

    return (
        <div className="informasjon-side">
            <Banner>{t("app.tittel")}</Banner>
            <Wrapper className="blokk-center">
                <UthevetPanel className="panel-glippe-over">
                    <StyledElla>
                        <EllaBlunk size="175" />
                    </StyledElla>
                    <Heading as="p" size="large" spacing>
                        {t("tilgang.header", {
                            fornavn: data?.data.fornavn,
                        })}
                    </Heading>
                    <BodyLong spacing>{t("tilgang.info")}</BodyLong>
                </UthevetPanel>
            </Wrapper>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
    props: {
        ...(await serverSideTranslations(ctx.locale ?? "nb", ["common"])),
    },
});

export default Forbidden;
