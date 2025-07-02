import * as React from "react";
import { BodyLong, Heading } from "@navikt/ds-react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { logger } from "@navikt/next-logger";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Banner from "../banner/Banner";
import { UthevetPanel } from "../paneler/UthevetPanel";
import { ApplicationSpinner } from "../applicationSpinner/ApplicationSpinner";
import EllaBlunk from "../ellaBlunk";
import { TilgangResponse } from "../../generated/model";
import { browserEnv } from "../../config/env";
import { getSessionMetadata } from "../../generated/session-metadata-controller/session-metadata-controller";

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
    harTilgang: TilgangResponse | null;
}

const sessionUrl = process.env.NEXT_PUBLIC_LOGIN_BASE_URL + "/oauth2/session";
const loginUrl = process.env.NEXT_PUBLIC_LOGIN_BASE_URL + "/oauth2/login";
const dekoratorApiInfoUrl = browserEnv.NEXT_PUBLIC_DEKORATOR_API_BASE_URL + "/auth";
const logoutUrl = browserEnv.NEXT_PUBLIC_INNSYN_ORIGIN + process.env.NEXT_PUBLIC_DEKORATOREN_LOGOUT_URL;
const fetchDekoratorAuth = async () => {
    try {
        const response = await fetch(dekoratorApiInfoUrl, { method: "get", credentials: "include" });
        if (response.status === 401) {
            return { status: 401 };
        }
        if (response.ok) {
            const data: { userId: string } = await response.json();
            return { data, status: response.status };
        }
        return { status: response.status };
    } catch (e: unknown) {
        return { error: e };
    }
};

const fetchDekoratorSession = async () => {
    const response = await fetch(sessionUrl, {
        method: "get",
        credentials: "include",
    });
    try {
        if (response.status === 401) {
            return { status: 401 };
        }
        if (response.ok) {
            const data: { session: { active: boolean } } = await response.json();
            return { data, status: response.status };
        }
        return { status: response.status };
    } catch (e: unknown) {
        return { error: e };
    }
};

const Tilgangskontrollside = ({ children, harTilgang }: TilgangskontrollsideProps) => {
    const router = useRouter();
    const t = useTranslations("common");
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        if (!["local", "mock", "e2e"].includes(browserEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT)) {
            setIsLoading(true);
            fetchDekoratorSession()
                .then((result) => {
                    if (result.status === 401 || result.data?.session.active === false) {
                        return window.location.replace(loginUrl + "?redirect=" + window.location.href);
                    }
                    Promise.all([fetchDekoratorAuth(), getSessionMetadata()]).then(
                        ([decoratorSession, innsynSession]) => {
                            if (decoratorSession.data?.userId !== innsynSession.personId) {
                                if (decoratorSession.error) {
                                    logger.warn(
                                        `Fikk feil under innhenting av dekorator-session. Error: ${decoratorSession.error}`
                                    );
                                }
                                logger.warn(
                                    `Dekorator userId does not match innsyn session personId. ${!decoratorSession.data?.userId ? "No userId from dekorator session" : ""}`
                                );
                                return window.location.replace(logoutUrl);
                            }
                        }
                    );
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="informasjon-side">
                {!router.pathname.includes("/utbetaling") && <Banner>{t("app.tittel")}</Banner>}
                <ApplicationSpinner />
            </div>
        );
    }

    if (harTilgang?.harTilgang === false) {
        const fornavn = harTilgang?.fornavn;
        if (!fornavn || fornavn === "") {
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
