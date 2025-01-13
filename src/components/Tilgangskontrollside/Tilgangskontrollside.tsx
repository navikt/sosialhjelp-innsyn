import * as React from "react";
import { BodyLong, Heading } from "@navikt/ds-react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { logger } from "@navikt/next-logger";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

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

const sessionUrl = process.env.NEXT_PUBLIC_LOGIN_BASE_URL + "/oauth2/session";
const loginUrl = process.env.NEXT_PUBLIC_LOGIN_BASE_URL + "/oauth2/login";

const useDekoratorLogin = () =>
    useQuery({
        queryKey: ["dekorator-login"],
        queryFn: async () => {
            const result = await fetch(sessionUrl, {
                method: "get",
                credentials: "include",
            });
            const data: { session: { active: boolean } } | undefined =
                result.status === 200 ? await result.json() : undefined;
            return { status: result.status, ...data };
        },
    });

const Tilgangskontrollside: React.FC<TilgangskontrollsideProps> = ({ children }) => {
    const router = useRouter();
    const { t } = useTranslation();
    const { error, isPending, data: harTilgangData } = useHarTilgang();

    const sessionQuery = useDekoratorLogin();
    useEffect(() => {
        if (
            !sessionQuery.isPending &&
            (sessionQuery.data?.status === 401 || sessionQuery.data?.session?.active === false)
        ) {
            router.replace(loginUrl + "?redirect=" + window.location.href);
        }
    }, [sessionQuery.data, sessionQuery.isPending, router]);

    if (sessionQuery.isPending || isPending) {
        return (
            <div className="informasjon-side">
                {!router.pathname.includes("/utbetaling") && <Banner>{t("app.tittel")}</Banner>}
                <ApplicationSpinner />
            </div>
        );
    }

    if (error) {
        logger.error(`Fikk feilmelding fra harTilgang. Code: ${harTilgangData?.status}, message: ${error.message}`);
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
