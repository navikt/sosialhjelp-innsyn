import { BodyLong, Heading } from "@navikt/ds-react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { logger } from "@navikt/next-logger";
import { useRouter } from "next/router";

import { useHarTilgang } from "../../generated/tilgang-controller/tilgang-controller";
import Banner from "../banner/Banner";
import { UthevetPanel } from "../paneler/UthevetPanel";
import { ApplicationSpinner } from "../applicationSpinner/ApplicationSpinner";
import EllaBlunk from "../ellaBlunk";

const StyledElla = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    margin-top: 2rem;
`;

export interface TilgangskontrollsideProps {
    children: React.ReactNode;
}

const Tilgangskontrollside = ({ children }: TilgangskontrollsideProps) => {
    const router = useRouter();
    const { t } = useTranslation();

    const { error, isPending, data: harTilgangData } = useHarTilgang();

    if (isPending) {
        return (
            <div className="informasjon-side">
                {!router.pathname.includes("/utbetaling") && <Banner>{t("app.tittel")}</Banner>}
                <ApplicationSpinner />
            </div>
        );
    }

    if (error) {
        logger.warn(
            `Fikk feilmelding fra harTilgang. status: ${harTilgangData?.status}, message: ${error.message}, error code: ${error.code}, error: ${error}`
        );
    }

    const isAuthError = harTilgangData?.status === 401 || harTilgangData?.status === 403;
    if (isAuthError || (harTilgangData && !harTilgangData.data.harTilgang)) {
        const fornavn = harTilgangData?.data.fornavn;
        if (fornavn === "") {
            logger.warn(`Viser tilgangskontrollside uten fornavn`);
        } else {
            logger.warn(`Viser tilgangskontrollside med fornavn`);
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
                                fornavn,
                            })}
                        </Heading>
                        <BodyLong spacing>{t("tilgang.info")}</BodyLong>
                    </UthevetPanel>
                </Wrapper>
            </div>
        );
    }

    return <>{children}</>;
};

export default Tilgangskontrollside;
